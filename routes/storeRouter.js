const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

// 1. Home & Index
router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList); // Matches the renamed function
router.get("/homes/:homeId", storeController.getHomeDetails);

// 2. Search (The Fix)
// We point this to the new "Super Search" function
router.get("/search", storeController.getSearchResults);

// 3. Bookings
router.get("/bookings", storeController.getBookings);
router.post("/bookings", storeController.postBooking);
router.post("/cancel-booking", storeController.postCancelBooking); // Ensure this matches


// 4. Favourites
router.get("/favourite-list", storeController.getFavouriteList);
router.post("/favourite-list", storeController.postAddToFavourite);
router.post("/favourite-list/remove", storeController.postRemoveFavourite);

module.exports = router;