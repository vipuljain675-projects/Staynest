const Home = require("../models/home");
const Booking = require("../models/booking");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res, next) => {
  res.render("store/index", {
    pageTitle: "Airbnb | Welcome",
    currentPage: "index",
  });
};

exports.getHomeList = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("store/home-list", {
        pageTitle: "Explore Homes",
        currentPage: "home-list",
        homes: homes, // FIX: Renamed from 'registeredHomes' to 'homes'
        isSearch: false,
      });
    })
    .catch((err) => console.log(err));
};

exports.getSearch = (req, res, next) => {
  const query = req.query.query;
  Home.find({
    $or: [
      { houseName: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } }
    ]
  })
    .then((searchResults) => {
      res.render("store/home-list", {
        pageTitle: `Search results for "${query}"`,
        currentPage: "home-list",
        homes: searchResults, // FIX: Renamed from 'registeredHomes' to 'homes'
        isSearch: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
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
  Favourite.find()
    .populate('homeId')
    .then((favourites) => {
      const favouriteHomes = favourites
        .map(fav => fav.homeId)
        .filter(home => home !== null);

      res.render("store/favourite-list", {
        pageTitle: "My Favourites",
        currentPage: "favourites",
        favouriteHomes: favouriteHomes,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  const fav = new Favourite({ homeId: homeId });
  
  fav.save()
    .then(() => res.redirect("/favourite-list"))
    .catch((err) => console.log(err));
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.findOneAndDelete({ homeId: homeId })
    .then(() => res.redirect("/favourite-list"))
    .catch((err) => console.log(err));
};

exports.getBookings = (req, res, next) => {
  Booking.find()
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
  Home.findById(homeId)
    .then((home) => {
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
  const { homeId, homeName, pricePerNight, checkIn, checkOut, firstName, lastName, phone, email } = req.body;
  
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 
  const totalPrice = diffDays * pricePerNight;
  
  const booking = new Booking({
    homeId, homeName, 
    startDate: checkIn, 
    endDate: checkOut, 
    totalPrice, firstName, lastName, phone, email
  });
  
  booking.save()
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};

exports.postCancelBooking = (req, res, next) => {
  const bookingId = req.body.bookingId;
  Booking.findByIdAndDelete(bookingId)
    .then(() => res.redirect("/bookings"))
    .catch((err) => console.log(err));
};