const Home = require("../models/home");
const Booking = require("../models/booking");

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
    // ✅ FIX: Find by ID, not Name
    const home = homes.find((h) => h.id === homeId);
    
    if (!home) {
        return res.redirect("/homes");
    }

    res.render("store/home-detail", {
      pageTitle: "Home Detail",
      currentPage: "home-list",
      home: home,
    });
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

exports.getFavouriteList = (req, res, next) => {
  res.render("store/favourite-list", {
    pageTitle: "My Favourites",
    currentPage: "favourites",
  });
};

exports.getReserve = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    // ✅ FIX: Find by ID, not Name
    const home = homes.find((h) => h.id === homeId);
    
    if (!home) {
        return res.redirect("/homes");
    }

    res.render("store/reserve", {
      pageTitle: "Confirm Booking",
      currentPage: "home-list",
      homeId: homeId,
      home: home,
    });
  });
};

exports.postBooking = (req, res, next) => {
  const { 
    homeId, homeName, pricePerNight, checkIn, checkOut,
    firstName, lastName, phone, email, guests 
  } = req.body;

  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const totalPrice = diffDays * pricePerNight;

  const booking = new Booking(
    homeId, homeName, checkIn, checkOut, totalPrice,
    firstName, lastName, phone, email, guests
  );
  
  booking.save();
  res.redirect("/bookings");
};