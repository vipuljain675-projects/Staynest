const express = require("express");
const router = express.Router();
const hostController = require("../controllers/hostController");

// 1. Add Home
router.get("/add-home", hostController.getAddHome);
router.post("/add-home", hostController.postAddHome);

// 2. Host Dashboard
router.get("/host-home-list", hostController.getHostHomes);

// 3. Edit Home
router.get("/edit-home/:homeId", hostController.getEditHome);
// ✅ NEW: Route to handle the Edit Form submission
router.post("/edit-home", hostController.postEditHome);

// 4. Delete Home
router.post("/delete-home", hostController.postDeleteHome);

exports.router = router;