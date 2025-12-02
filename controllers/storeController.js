const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/index", { 
      pageTitle: "Airbnb | Holiday Rentals", 
      currentPage: "index",
      registeredHomes: registeredHomes 
    });
  });
}

exports.getHomeList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("store/home-list", { 
      pageTitle: "Homes List", 
      currentPage: "home-list", 
      registeredHomes: registeredHomes 
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", { 
    pageTitle: "My Bookings", 
    currentPage: "bookings" 
  });
};

exports.getFavouriteList = (req, res, next) => {
  res.render("store/favourite-list", { 
    pageTitle: "My Favourites", 
    currentPage: "favourites" 
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.fetchAll((homes) => {
    const home = homes.find(h => h.houseName === homeId) || homes[0]; // Simple find logic for now
    res.render("store/home-detail", { 
      pageTitle: "Home Detail", 
      currentPage: "home-list", 
      home: home
    });
  })
};

exports.getReserve = (req, res, next) => {
    res.render("store/reserve", {
        pageTitle: "Confirm Booking",
        currentPage: "home-list",
        homeId: req.params.homeId
    })
}