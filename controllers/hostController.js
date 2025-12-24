const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "add-home",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const files = req.files; 

  if (!files || files.length === 0) {
    return res.status(422).render("host/edit-home", {
      pageTitle: "Add Home",
      currentPage: "add-home",
      editing: false,
      hasError: true,
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
      home: { houseName, price, location, rating, description },
    });
  }

  const imageUrl = "/" + files[0].path;

  const home = new Home({
    houseName: houseName,
    price: price,
    location: location,
    rating: rating,
    description: description,
    imageUrl: imageUrl,
    // FIX 1: Safety check to prevent crash if user is not logged in
    userId: req.user ? req.user._id : null, 
  });

  home.save()
    .then((result) => {
      console.log("Created Home");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHostHomes = (req, res, next) => {
  const userId = req.user ? req.user._id : null;
  
  Home.find({ userId: userId })
    .then((homes) => {
      // FIX 2: Changed to "host/host-home-list" to match your file structure
      res.render("host/host-home-list", { 
        homes: homes,
        pageTitle: "Host Homes",
        currentPage: "host-homes",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditHome = (req, res, next) => {
  const editMode = req.query.editing;
  if (!editMode) {
    return res.redirect("/");
  }
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.redirect("/");
      }
      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        currentPage: "host-homes",
        editing: editMode,
        home: home,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  const files = req.files; 

  Home.findById(id)
    .then((home) => {
      if (!home) {
        return res.redirect("/");
      }
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;
      
      if (files && files.length > 0) {
        home.imageUrl = "/" + files[0].path;
      }
      
      return home.save();
    })
    .then((result) => {
      console.log("UPDATED HOME!");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId; 
  Home.findByIdAndDelete(homeId)
    .then(() => {
      console.log("DESTROYED HOME");
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log(err));
};