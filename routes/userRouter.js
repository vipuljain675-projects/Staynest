const express = require("express");
const router = express.Router();

/* ✅ IMPORT FROM HOST ROUTER (TUTORIAL STYLE) */
const { registeredHomes } = require("./hostRouter");

/* ✅ HOME PAGE */
router.get("/", (req, res) => {
  res.render("home", { registeredHomes: registeredHomes });
});

module.exports = router;
