const express = require("express");
const router = express.Router();

/* ✅ TUTORIAL-STYLE STORAGE */
const registeredHomes = [];

/* ✅ SHOW ADD HOME FORM */
router.get("/add-home", (req, res) => {
  res.render("addHome");
});

/* ✅ HANDLE FORM SUBMISSION */
router.post("/add-home", (req, res) => {
  const { houseName, price, location, rating, image } = req.body;

  const homeData = {
    name: houseName,
    price,
    location,
    rating,
    image
  };

  registeredHomes.push(homeData);

  console.log("Registered Homes:", registeredHomes);

  res.render("homeAdded");
});


/* ✅ EXPORT BOTH (IMPORTANT) */
module.exports = {
  router,
  registeredHomes
};
