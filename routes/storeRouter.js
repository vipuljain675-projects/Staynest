const express = require("express");
const storeController = require("../controllers/storeController");
const router = express.Router();

router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList);
router.get("/homes/:homeId", storeController.getHomeDetails);

router.get("/favourites", storeController.getFavouriteList);
router.post("/favourites", storeController.postAddToFavourite);
router.post("/favourites/remove-favourite", storeController.postRemoveFavourite);

router.get("/bookings", storeController.getBookings);
router.post("/bookings", storeController.postBooking);
router.post("/bookings/cancel", storeController.postCancelBooking);

// ✅ THIS WAS MISSING! Adding it back now:
router.get("/reserve/:homeId", storeController.getReserve);

router.get("/search", storeController.getSearch);

module.exports = router;