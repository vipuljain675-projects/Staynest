const express = require("express");
const hostController = require("../controllers/hostController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.get("/add-home", hostController.getAddHome);
router.post("/add-home", upload.array("photos", 3), hostController.postAddHome);

router.get("/host-home-list", hostController.getHostHomes);

router.get("/edit-home/:homeId", hostController.getEditHome);
router.post("/edit-home", upload.array("photos", 3), hostController.postEditHome);

router.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = router;