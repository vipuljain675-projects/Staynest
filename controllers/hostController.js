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

  Home.findById(homeId, (home) => {
    if (!home) {
      return res.redirect("/");
    }
    res.render("host/edit-home", {
      pageTitle: "Edit Home",
      currentPage: "host-homes",
      editing: editing,
      home: home,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, rating, price, location, photoUrl } = req.body;
  const home = new Home(houseName, price, location, rating, photoUrl);
  home.save();
  res.render("host/home-added", {
    pageTitle: "Success",
    currentPage: "addHome",
  });
};

// ✅ NEW: Handles saving the edits
exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, photoUrl } = req.body;
  const updatedHomeData = { houseName, price, location, rating, photoUrl };
  
  Home.updateById(id, updatedHomeData, () => {
    res.redirect("/host/host-home-list");
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.body.homeId;
  Home.deleteById(homeId, () => {
    res.redirect("/host/host-home-list");
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Dashboard",
      currentPage: "host-homes",
    });
  });
};