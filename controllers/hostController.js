const Home = require("../models/home");
const Booking = require("../models/booking"); // 🟢 ADDED THIS IMPORT

/* =========================
   1. HOST ENTRY POINT
========================= */

exports.getHostDashboard = (req, res, next) => {
  // If user is NOT logged in, show the Landing Page
  if (!req.user) {
    return res.render("host/host-landing", {
      pageTitle: "Become a Host",
      currentPage: "host-landing",
      isAuthenticated: false
    });
  }

  // If logged in, check if they have homes
  Home.find({ userId: req.user._id })
    .then(homes => {
      if (homes.length === 0) {
        return res.redirect("/host/add-home");
      }
      res.redirect("/host/host-home-list");
    })
    .catch(err => console.log(err));
};

/* =========================
   2. MANAGE HOMES (CRUD)
========================= */

exports.getHostHomes = (req, res, next) => {
  if (!req.user) return res.redirect("/host");

  Home.find({ userId: req.user._id })
    .then((homes) => {
      res.render("host/host-home-list", {
        pageTitle: "Your Listing",
        currentPage: "host-home-list",
        homes: homes,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "add-home",
    editing: false,
    home: null
  });
};

exports.postAddHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  const { houseName, price, location, rating, description, amenities, availableFrom, availableTo } = req.body;
  
  // Handle Amenities (Array or String)
  let selectedAmenities = [];
  if (amenities) {
      selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
  }

  // Handle Images
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
  } else {
      photoUrls = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop"];
  }

  const newHome = new Home({
    houseName, price, location, rating, description,
    photoUrl: photoUrls, 
    amenities: selectedAmenities,
    availableFrom: new Date(availableFrom),
    availableTo: new Date(availableTo),
    userId: req.user._id, 
  });

  newHome.save().then(() => {
    res.render("host/home-added", {
      pageTitle: "Home Added",
      currentPage: "host-home-list",
    });
  })
  .catch(err => {
      console.log("Error saving home:", err);
      res.redirect('/host/add-home');
  });
};

exports.getEditHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) return res.redirect("/host/host-home-list");

      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        currentPage: "host-home-list",
        editing: true,
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  const { id, houseName, price, location, rating, description, amenities, availableFrom, availableTo } = req.body;

  Home.findById(id).then((home) => {
    if (!home) return res.redirect("/host/host-home-list");

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;
    home.availableFrom = new Date(availableFrom);
    home.availableTo = new Date(availableTo);

    let selectedAmenities = [];
    if (amenities) {
        selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
    }
    home.amenities = selectedAmenities;

    if (req.files && req.files.length > 0) {
       const newPhotoUrls = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
       home.photoUrl = newPhotoUrls;
    }

    return home.save();
  })
  .then(() => {
    res.redirect("/host/host-home-list");
  })
  .catch((err) => console.log(err));
};

exports.postDeleteHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  const homeId = req.params.homeId; 
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log(err));
};

/* =========================
   3. HOST BOOKING MANAGEMENT
   (Handle Requests)
========================= */

// Show the Dashboard
exports.getHostBookings = (req, res, next) => {
  Home.find({ userId: req.user._id })
    .then(homes => {
      const homeIds = homes.map(home => home._id);
      
      return Booking.find({ homeId: { $in: homeIds } })
        .populate('userId') 
        .populate('homeId') 
        .sort({ createdAt: -1 }); 
    })
    .then(bookings => {
      res.render("host/manage-bookings", {
        pageTitle: "Manage Requests",
        currentPage: "manage-bookings",
        bookings: bookings,
        isAuthenticated: true,
        user: req.user
      });
    })
    .catch(err => console.log(err));
};

// Handle Accept/Reject
exports.postHandleBooking = (req, res, next) => {
  const { bookingId, action } = req.body; 
  
  Booking.findByIdAndUpdate(bookingId, { status: action })
    .then(() => {
      res.redirect("/host/manage-bookings"); // Refresh page
    })
    .catch(err => console.log(err));
};