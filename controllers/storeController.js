const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");

/* =========================
   HOME / INDEX
========================= */

exports.getIndex = (req, res) => {
  Home.find()
    .then((homes) => {
      res.render("store/index", {
        pageTitle: "Airbnb | Welcome",
        currentPage: "index",
        homes: homes,
        isHomeIndex: true, // Hides the top search bar so we use the big Hero one
      });
    })
    .catch((err) => console.log(err));
};

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

/* =========================
   HOME DETAILS
========================= */

exports.getHomeDetails = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .populate("userId") // Shows host info
    .then((home) => {
      if (!home) return res.redirect("/homes");

      res.render("store/home-detail", {
        pageTitle: home.houseName,
        currentPage: "home-list",
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

/* =========================
   THE SUPER SEARCH ENGINE
   (Replaces old getSearch & getSearchResults)
========================= */

exports.getSearchResults = (req, res, next) => {
  const { location, checkIn, checkOut, q } = req.query;

  // 🟢 1. UNIFIED SEARCH TEXT
  // Use 'location' (Hero Form) OR 'q' (Navbar) OR default to empty string
  let searchLocation = "";
  if (location) {
    searchLocation = location;
  } else if (q) {
    searchLocation = q;
  }

  const searchFilter = {
    location: { $regex: searchLocation, $options: "i" },
  };

  // 🟢 2. DATE AVAILABILITY LOGIC
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Filter 1: Host Availability Window
    searchFilter.availableFrom = { $lte: start };
    searchFilter.availableTo = { $gte: end };

    // Filter 2: Booking Collisions
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
    // 🟢 3. SIMPLE SEARCH (Location Only)
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
   BOOKINGS & RESERVATIONS
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

exports.getReserve = (req, res, next) => {
  const homeId = req.params.homeId;
  // 🟢 1. Extract dates from the URL query
  const { checkIn, checkOut } = req.query;

  if (!req.user) {
    return res.render("store/book-login", {
      pageTitle: "Login Required",
      currentPage: "login",
      isAuthenticated: false
    });
  }

  Home.findById(homeId)
    .then(home => {
      if (!home) return res.redirect("/homes");
      
      // 🟢 2. Pass dates to the view
      res.render("store/reserve", {
        pageTitle: "Confirm and Pay",
        currentPage: "reserve",
        home: home,
        user: req.user,
        checkIn: checkIn,   // Pass these down
        checkOut: checkOut
      });
    })
    .catch(err => console.log(err));
};

exports.postBooking = (req, res, next) => {
  const { homeId, checkIn, checkOut, adults, children, seniors } = req.body;
  const newCheckIn = new Date(checkIn);
  const newCheckOut = new Date(checkOut);

  // 1. COLLISION CHECK
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
      // 🛑 STOPPER: If dates are busy, render error and return NULL
      res.render("store/booking-failed", {
        pageTitle: "Dates Unavailable",
        currentPage: "bookings",
        homeId: homeId
      });
      return null; 
    }

    // 2. SAVE BOOKING (Only runs if dates are free)
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
      // 🟢 SAFETY CHECK: Only redirect if we actually saved a booking
      // If 'savedBooking' is null (because of collision), we do nothing.
      if (savedBooking) {
          res.redirect("/bookings");
      }
  })
  .catch(err => console.log(err));
};
exports.postCancelBooking = (req, res) => {
  Booking.findByIdAndDelete(req.body.bookingId)
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};

/* =========================
   FAVOURITES
========================= */

exports.getFavouriteList = (req, res, next) => {
  Favourite.find({ userId: req.user._id })
    .populate("homeId")
    .then((favourites) => {
      const homes = favourites
        .map((f) => f.homeId)
        .filter((home) => home !== null); // Filter out deleted homes
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