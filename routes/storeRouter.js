// routes/storeRouter.js
const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

// --- Home Routes ---
router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList);
router.get("/homes/:homeId", storeController.getHomeDetails);

// --- Favourites ---
router.get("/favourite-list", storeController.getFavouriteList);
router.post("/favourite", storeController.postAddToFavourite);
router.post("/favourite-remove", storeController.postRemoveFavourite);

// --- Bookings (THIS IS THE KEY PART) ---
// If this line is missing or not saved, you get a 404
router.get("/bookings", storeController.getBookings); 
router.post("/book", storeController.postBooking);
router.post("/bookings/delete", storeController.postCancelBooking);

// --- Search & Reserve ---
router.get("/reserve/:homeId", storeController.getReserve);
router.get("/search", storeController.getSearch);

module.exports = router;