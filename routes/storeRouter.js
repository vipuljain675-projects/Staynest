const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

// 1. Home & Index
router.get("/", storeController.getHomeList);
router.get("/homes/:homeId", storeController.getHomeDetails);

// 2. Search
router.get("/search", storeController.getSearchResults);

// 3. Bookings
router.get("/bookings", storeController.getBookings);
// 🟢 NEW: Route for the "Login to Book" page
router.get("/book-login", storeController.getBookLogin); 
router.post("/bookings", storeController.postBooking);
router.post("/cancel-booking", storeController.postCancelBooking);

// 4. Favourites
router.get("/favourite-list", storeController.getFavouriteList);
router.post("/favourite-list", storeController.postAddToFavourite);
router.post("/favourite-list/remove", storeController.postRemoveFavourite);

module.exports = router;