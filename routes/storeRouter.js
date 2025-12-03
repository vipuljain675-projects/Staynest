const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList);
router.get("/bookings", storeController.getBookings);
router.get("/homes/:homeId", storeController.getHomeDetails);
router.get("/reserve/:homeId", storeController.getReserve);
router.post("/bookings", storeController.postBooking);

// ✅ NEW FAVOURITE ROUTES
router.get("/favourites", storeController.getFavouriteList);
router.post("/favourites", storeController.postAddToFavourite);
router.post("/favourites/delete", storeController.postRemoveFavourite);

module.exports = router;