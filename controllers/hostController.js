const Home = require("../models/home");

// 🟢 RESTORED: This was missing and caused the crash
exports.getHostDashboard = (req, res, next) => {
  res.redirect('/host/host-home-list');
};

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "add-home",
    editing: false,
    home: null
  });
};

exports.getEditHome = (req, res, next) => {
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
  const { houseName, price, location, rating, description } = req.body;
  
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => "/" + file.path.replace(/\\/g, "/"));
  } else {
      photoUrls = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop"];
  }

  const newHome = new Home({
    houseName,
    price,
    location,
    rating,
    photoUrl: photoUrls, 
    description,
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
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id).then((home) => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

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
  // 🟢 FIX: Use req.params because the route is /delete-home/:homeId
  const homeId = req.params.homeId; 
  
  Home.findByIdAndDelete(homeId)
    .then(() => {
      console.log("Deleted Home:", homeId); // Optional: for debugging
      res.redirect("/host/host-home-list");
    })
    .catch((err) => console.log(err));
};
// 🟢 RENAMED: Changed from 'getHostHomeList' to 'getHostHomes' to match your Router
exports.getHostHomes = (req, res, next) => {
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