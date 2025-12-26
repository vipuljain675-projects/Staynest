const Home = require("../models/home");

// 🟢 UPDATED: Entry Point for "Switch to Host"
exports.getHostDashboard = (req, res, next) => {
  // If user is NOT logged in, show the Sexy Landing Page
  if (!req.user) {
    return res.render("host/host-landing", {
      pageTitle: "Become a Host",
      currentPage: "host-landing",
      isAuthenticated: false
    });
  }

  // If user IS logged in, check if they have homes
  Home.find({ userId: req.user._id })
    .then(homes => {
      // If they have no homes, go to "Add Home"
      if (homes.length === 0) {
        return res.redirect("/host/add-home");
      }
      // If they have homes, go to their list
      res.redirect("/host/host-home-list");
    })
    .catch(err => console.log(err));
};

exports.getAddHome = (req, res, next) => {
  // 🛡️ Security Check
  if (!req.user) return res.redirect('/login');
  
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "add-home",
    editing: false,
    home: null
  });
};

exports.getEditHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.redirect("/host/host-home-list");
      }
      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        currentPage: "host-home-list",
        editing: true,
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  // 1. Extract all data including the new Amenities and Dates
  const { 
    houseName, price, location, rating, description, 
    amenities, availableFrom, availableTo 
  } = req.body;
  
  // 2. Handle Amenities (HTML sends a String if 1 item, Array if multiple)
  let selectedAmenities = [];
  if (amenities) {
      selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
  }

  // 3. Handle Images
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
  } else {
      // Default image if none provided
      photoUrls = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop"];
  }

  // 4. Create the Home Object
  const newHome = new Home({
    houseName,
    price,
    location,
    rating,
    description,
    photoUrl: photoUrls, 
    
    // 🟢 NEW: Save Amenities and Dates
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

exports.postEditHome = (req, res, next) => {
  if (!req.user) return res.redirect('/login');

  // 1. Extract all data including ID, Amenities, and Dates
  const { 
    id, houseName, price, location, rating, description,
    amenities, availableFrom, availableTo 
  } = req.body;

  Home.findById(id).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    // 2. Update Basic Fields
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    // 3. Update Amenities (Ensure it is always an array)
    let selectedAmenities = [];
    if (amenities) {
        selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
    }
    home.amenities = selectedAmenities;

    // 4. Update Dates
    home.availableFrom = new Date(availableFrom);
    home.availableTo = new Date(availableTo);

    // 5. Update Photos (Only if new ones are uploaded)
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

exports.getHostHomes = (req, res, next) => {
  // 🟢 CRASH FIX: If user is not logged in, send them to the landing page instead of crashing
  if (!req.user) {
    return res.redirect("/host"); 
  }

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