const express = require('express');
const multer = require('multer');
const hostController = require('../controllers/hostController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// HOST ENTRY POINT
router.get('/', hostController.getHostDashboard);

// ADD / EDIT
router.get('/add-home', hostController.getAddHome);
router.post('/add-home', upload.array('photos', 5), hostController.postAddHome);

router.get('/host-home-list', hostController.getHostHomes);

router.get('/edit-home/:homeId', hostController.getEditHome);
router.post('/edit-home', upload.array('photos', 5), hostController.postEditHome);

router.post('/delete-home/:homeId', hostController.postDeleteHome);

module.exports = router;
