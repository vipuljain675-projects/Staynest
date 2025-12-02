const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", { 
    pageTitle: "Add Home", 
    currentPage: "addHome"
  });
};

exports.getEditHome = (req, res, next) => {
  res.render("host/edit-home", { 
    pageTitle: "Edit Home", 
    currentPage: "host-homes"
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render("host/host-home-list", { 
      registeredHomes: registeredHomes, 
      pageTitle: "Host Dashboard", 
      currentPage: "host-homes" 
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, rating, price, location, photoUrl } = req.body;
  const home = new Home(houseName, price, location, rating, photoUrl);
  home.save();
  res.render("host/home-added", { 
    pageTitle: "Success", 
    currentPage: "addHome" 
  });
};

exports.postDeleteHome = (req, res, next) => {
  console.log("Delete Request for:", req.body);
  res.redirect("/host/host-home-list");
};