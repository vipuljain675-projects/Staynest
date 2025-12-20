const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  if (!editing) {
    return res.redirect("/host/host-home-list");
  }

  Home.findById(homeId)
    .then(([homes]) => {
      const home = homes[0];
      if (!home) {
        return res.redirect("/");
      }
      res.render("host/edit-home", {
        pageTitle: "Edit Home",
        currentPage: "host-homes",
        editing: editing,
        home: home,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddHome = (req, res, next) => {
  // 1. We extract all fields, including description
  const { houseName, rating, price, location, photoUrl, description } = req.body;
  
  // 2. SAFETY CHECK: If description is undefined, use an empty string ""
  // This prevents the "Bind parameters cannot be undefined" crash
  const validDescription = description || ""; 

  const home = new Home(houseName, price, location, rating, photoUrl, validDescription);
  
  home.save()
    .then(() => {
      res.render("host/home-added", {
        pageTitle: "Success",
        currentPage: "addHome",
      });
    })
    .catch((err) => {
      console.log("Error saving home:", err);
      res.redirect("/host/add-home"); // Redirect back on error
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl, description } = req.body;
  
  // Safety check for edit as well
  const validDescription = description || "";

  const updatedHomeData = { 
    houseName, 
    price, 
    location, 
    rating, 
    photoUrl, 
    description: validDescription 
  };
  
  Home.updateById(id, updatedHomeData)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log("Error updating home:", err));
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.body.homeId;
  Home.deleteById(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log("Error deleting home:", err));
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll()
    .then(([registeredHomes]) => {
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Host Dashboard",
        currentPage: "host-homes",
      });
    })
    .catch((err) => console.log(err));
};