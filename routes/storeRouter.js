const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.getIndex);
router.get("/homes", storeController.getHomeList);
router.get("/bookings", storeController.getBookings);
router.get("/favourites", storeController.getFavouriteList);
router.get("/homes/:homeId", storeController.getHomeDetails);
router.get("/reserve/:homeId", storeController.getReserve);

module.exports = router;