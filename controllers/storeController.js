const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");

/* =========================
   1. HOME LIST & DETAILS
========================= */

exports.getHomeList = (req, res) => {
  Home.find()
    .then((homes) => {
      res.render("store/home-list", {
        pageTitle: "Explore Homes",
        currentPage: "home-list",
        homes: homes,
        isSearch: false,
      });
    })
    .catch((err) => console.log(err));
};

exports.getHomeDetails = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .populate("userId") // Shows host info
    .then((home) => {
      if (!home) return res.redirect("/");

      res.render("store/home-detail", {
        pageTitle: home.houseName,
        currentPage: "home-list",
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

/* =========================
   2. THE SUPER SEARCH ENGINE
========================= */

exports.getSearchResults = (req, res, next) => {
  const { location, checkIn, checkOut, q } = req.query;

  // 1. Unified Search Text
  // Use 'location' (Hero Form) OR 'q' (Navbar)
  let searchLocation = "";
  if (location) {
    searchLocation = location;
  } else if (q) {
    searchLocation = q;
  }

  const searchFilter = {
    location: { $regex: searchLocation, $options: "i" },
  };

  // 2. Date Availability Logic
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Filter A: Host Availability Window
    searchFilter.availableFrom = { $lte: start };
    searchFilter.availableTo = { $gte: end };

    // Filter B: Booking Collisions (Exclude homes already booked)
    Booking.find({
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } },
      ],
    })
      .then((busyBookings) => {
        const busyHomeIds = busyBookings.map((b) => b.homeId);
        // Exclude busy homes
        searchFilter._id = { $nin: busyHomeIds };
        return Home.find(searchFilter);
      })
      .then((homes) => {
        res.render("store/home-list", {
          pageTitle: `Stays in ${searchLocation}`,
          currentPage: "home-list",
          homes: homes,
          isSearch: true,
        });
      })
      .catch((err) => console.log(err));
  } else {
    // 3. Simple Search (Location Only)
    Home.find(searchFilter)
      .then((homes) => {
        res.render("store/home-list", {
          pageTitle: `Stays in ${searchLocation}`,
          currentPage: "home-list",
          homes: homes,
          isSearch: true,
        });
      })
      .catch((err) => console.log(err));
  }
};

/* =========================
   3. BOOKINGS & RESERVATIONS
========================= */

exports.getBookings = (req, res) => {
  Booking.find({ userId: req.user._id })
    .populate("homeId")
    .then((bookings) => {
      res.render("store/bookings", {
        pageTitle: "My Bookings",
        currentPage: "bookings",
        bookings: bookings,
      });
    })
    .catch((err) => console.log(err));
};

// 🟢 NEW: Renders your custom "Login to Book" page
exports.getBookLogin = (req, res, next) => {
  res.render("store/book-login", {
    pageTitle: "Login to Reserve",
    currentPage: "login",
    isAuthenticated: false, // Force false to show login form
    user: null
  });
};

exports.postBooking = (req, res, next) => {
  // 🟢 1. SECURITY CHECK: Redirect to your CUSTOM page if logged out
  if (!req.session.isLoggedIn) {
      return res.redirect("/book-login"); 
  }

  const { homeId, checkIn, checkOut, adults, children, seniors } = req.body;
  const newCheckIn = new Date(checkIn);
  const newCheckOut = new Date(checkOut);

  // 2. Collision Check (Double check before saving)
  Booking.find({
    homeId: homeId,
    $or: [
      { checkIn: { $lte: newCheckIn }, checkOut: { $gte: newCheckIn } },
      { checkIn: { $lte: newCheckOut }, checkOut: { $gte: newCheckOut } },
      { checkIn: { $gte: newCheckIn }, checkOut: { $lte: newCheckOut } }
    ]
  })
  .then(existingBookings => {
    if (existingBookings.length > 0) {
      // Dates are busy -> Show Error
      return res.render("store/booking-failed", {
        pageTitle: "Dates Unavailable",
        currentPage: "bookings",
        homeId: homeId,
        user: req.user, 
        isAuthenticated: req.session.isLoggedIn
      });
    }

    // 3. Save Booking Logic
    return Home.findById(homeId).then(home => {
        const differenceInTime = newCheckOut.getTime() - newCheckIn.getTime();
        const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24)); 
        const totalPrice = nights * home.price;

        const newBooking = new Booking({
          homeId: homeId,
          userId: req.user._id,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          homeName: home.houseName,
          totalPrice: totalPrice,
          price: home.price,
          guests: {
            adults: parseInt(adults) || 1,
            children: parseInt(children) || 0,
            seniors: parseInt(seniors) || 0
          }
        });
        
        return newBooking.save();
    });
  })
  .then((savedBooking) => {
      // Only redirect if a booking was actually saved (not null)
      if (savedBooking) {
          res.redirect("/bookings");
      }
  })
  .catch(err => {
      console.log(err);
      res.redirect("/"); 
  });
};

exports.postCancelBooking = (req, res) => {
  Booking.findByIdAndDelete(req.body.bookingId)
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};

/* =========================
   4. FAVOURITES (WISHLIST)
========================= */

exports.getFavouriteList = (req, res, next) => {
  Favourite.find({ userId: req.user._id })
    .populate("homeId")
    .then((favourites) => {
      // Filter out any nulls (if a home was deleted but fav remains)
      const homes = favourites
        .map((f) => f.homeId)
        .filter((home) => home !== null);
        
      res.render("store/favourite-list", {
        pageTitle: "My Favourites",
        currentPage: "favourites",
        favouriteHomes: homes,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  
  // Check if already favourite to avoid duplicates
  Favourite.findOne({ userId: req.user._id, homeId: homeId })
    .then((fav) => {
      if (fav) return res.redirect("/favourite-list");
      
      const newFav = new Favourite({ userId: req.user._id, homeId: homeId });
      return newFav.save();
    })
    .then(() => res.redirect("/favourite-list"))
    .catch((err) => console.log(err));
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.findOneAndDelete({ userId: req.user._id, homeId: homeId })
    .then(() => {
      res.redirect("/favourite-list");
    })
    .catch((err) => console.log(err));
};