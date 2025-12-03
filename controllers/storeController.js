const Home = require("../models/home");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite"); // ✅ Import New Model

exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/index", {
      pageTitle: "Airbnb | Holiday Rentals",
      currentPage: "index",
      registeredHomes: registeredHomes,
    });
  });
};

exports.getHomeList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/home-list", {
      pageTitle: "Homes List",
      currentPage: "home-list",
      registeredHomes: registeredHomes,
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    const home = homes.find((h) => h.id === homeId);
    if (!home) return res.redirect("/homes");

    res.render("store/home-detail", {
      pageTitle: "Home Detail",
      currentPage: "home-list",
      home: home,
    });
  });
};

// ✅ NEW: Logic to Show Favourites
exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites((favIds) => {
    Home.fetchAll((homes) => {
      // Filter homes: Keep only the ones whose IDs are in the favIds list
      const favouriteHomes = homes.filter(home => favIds.includes(home.id));

      res.render("store/favourite-list", {
        pageTitle: "My Favourites",
        currentPage: "favourites",
        favouriteHomes: favouriteHomes,
      });
    });
  });
};

// ✅ NEW: Logic to Add to Favourites
exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.addToFavourites(homeId, () => {
    res.redirect("/favourites");
  });
};

// ✅ NEW: Logic to Remove from Favourites
exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.deleteById(homeId, () => {
    res.redirect("/favourites");
  });
};

exports.getBookings = (req, res, next) => {
  Booking.fetchAll((bookings) => {
    res.render("store/bookings", {
      pageTitle: "My Bookings",
      currentPage: "bookings",
      bookings: bookings,
    });
  });
};

exports.getReserve = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    const home = homes.find((h) => h.id === homeId);
    if (!home) return res.redirect("/homes");

    res.render("store/reserve", {
      pageTitle: "Confirm Booking",
      currentPage: "home-list",
      homeId: homeId,
      home: home,
    });
  });
};

exports.postBooking = (req, res, next) => {
  const { homeId, homeName, pricePerNight, checkIn, checkOut, firstName, lastName, phone, email, guests } = req.body;

  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 
  const totalPrice = diffDays * pricePerNight;

  const booking = new Booking(homeId, homeName, checkIn, checkOut, totalPrice, firstName, lastName, phone, email, guests);
  booking.save();
  res.redirect("/bookings");
};