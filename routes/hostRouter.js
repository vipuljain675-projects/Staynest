const express = require("express");
const hostController = require("../controllers/hostController");
const router = express.Router();

// 1. Add Home (Get Form & Post Data)
router.get("/add-home", hostController.getAddHome);
router.post("/add-home", hostController.postAddHome);

// 2. Host Home List (The Dashboard)
router.get("/host-home-list", hostController.getHostHomes);

// 3. Edit Home (Get Form & Post Data)
router.get("/edit-home/:homeId", hostController.getEditHome);
router.post("/edit-home", hostController.postEditHome);

// 4. Delete Home (THE MISSING ROUTE 👇)
router.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = { router }; // Note: Ensure your app.js imports this correctly!