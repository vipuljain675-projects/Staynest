// routes/storeRouter.js
const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

// 1. Landing Page (The "Welcome" Screen)
router.get("/", storeController.getIndex);

// 2. The Actual Homes List (The Grid)
router.get("/homes", storeController.getHomeList);

// 3. Search & Details
router.get("/search", storeController.getSearch);
router.get("/homes/:homeId", storeController.getHomeDetails);

// 4. Bookings
router.get("/bookings", storeController.getBookings);
router.post("/bookings", storeController.postBooking);
router.post("/bookings/delete", storeController.postCancelBooking);

// 5. Reserve Page
router.get("/reserve/:homeId", storeController.getReserve);

// 6. Favourites
router.get("/favourites", storeController.getFavouriteList);
router.post("/favourites/add", storeController.postAddToFavourite);
router.post("/favourites/delete", storeController.postRemoveFavourite);

module.exports = router;