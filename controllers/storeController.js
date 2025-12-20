const Home = require("../models/home");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res, next) => {
  Home.fetchAll()
    .then(([registeredHomes]) => {
      res.render("store/index", {
        pageTitle: "Airbnb | Holiday Rentals",
        currentPage: "index",
        registeredHomes: registeredHomes,
      });
    })
    .catch((err) => console.log(err));
};

exports.getHomeList = (req, res, next) => {
  Home.fetchAll()
    .then(([registeredHomes]) => {
      res.render("store/home-list", {
        pageTitle: "Homes List",
        currentPage: "home-list",
        registeredHomes: registeredHomes,
        isSearch: false,
      });
    })
    .catch((err) => console.log(err));
};

exports.getSearch = (req, res, next) => {
  const query = req.query.query;
  Home.search(query)
    .then(([searchResults]) => {
      res.render("store/home-list", {
        pageTitle: `Search results for "${query}"`,
        currentPage: "home-list",
        registeredHomes: searchResults,
        isSearch: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(([homes]) => {
      const home = homes[0];
      if (!home) return res.redirect("/homes");
      res.render("store/home-detail", {
        pageTitle: "Home Detail",
        currentPage: "home-list",
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites()
    .then(([favRows]) => {
      const favIds = favRows.map(row => row.homeId);
      return Home.fetchAll().then(([homes]) => {
        // IMPORTANT: Ensure ID types match (DB ID is number)
        const favouriteHomes = homes.filter((home) => favIds.includes(home.id));
        res.render("store/favourite-list", {
          pageTitle: "My Favourites",
          currentPage: "favourites",
          favouriteHomes: favouriteHomes,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.addToFavourites(homeId)
    .then(() => res.redirect("/favourites"))
    .catch((err) => console.log(err));
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.deleteById(homeId)
    .then(() => res.redirect("/favourites"))
    .catch((err) => console.log(err));
};

exports.getBookings = (req, res, next) => {
  Booking.fetchAll()
    .then(([bookings]) => {
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
  Home.findById(homeId)
    .then(([homes]) => {
      const home = homes[0];
      if (!home) return res.redirect("/homes");
      res.render("store/reserve", {
        pageTitle: "Confirm Booking",
        currentPage: "home-list",
        homeId: homeId,
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.postBooking = (req, res, next) => {
  const { homeId, homeName, pricePerNight, checkIn, checkOut, firstName, lastName, phone, email, guests } = req.body;
  
  // Calculate total price
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 
  const totalPrice = diffDays * pricePerNight;
  
  const booking = new Booking(homeId, homeName, checkIn, checkOut, totalPrice, firstName, lastName, phone, email, guests);
  
  booking.save()
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};

exports.postCancelBooking = (req, res, next) => {
  const bookingId = req.body.bookingId;
  Booking.deleteById(bookingId)
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};