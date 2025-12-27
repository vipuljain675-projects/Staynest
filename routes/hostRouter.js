const express = require('express');
const multer = require('multer');
const hostController = require('../controllers/hostController');

const router = express.Router();

// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// 🟢 1. MANAGE BOOKINGS (Remove "/host" from here)
// Resulting URL: /host/manage-bookings
router.get("/manage-bookings", hostController.getHostBookings);
router.post("/manage-bookings", hostController.postHandleBooking);

// 2. ADD HOME
router.get('/add-home', hostController.getAddHome);
router.post('/add-home', upload.array('photos', 5), hostController.postAddHome);

// 3. YOUR LISTINGS
router.get('/host-home-list', hostController.getHostHomes);

// 4. EDIT & DELETE
router.get('/edit-home/:homeId', hostController.getEditHome);
router.post('/edit-home', upload.array('photos', 5), hostController.postEditHome);
router.post('/delete-home/:homeId', hostController.postDeleteHome);

// 5. DASHBOARD (Root of /host)
router.get('/', hostController.getHostDashboard);

module.exports = router;