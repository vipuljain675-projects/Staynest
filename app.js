const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const User = require('./models/user');

// Import Routes
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');

const MONGODB_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

const app = express();

/* ---------------- SESSION STORE ---------------- */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.log('Session store error:', error);
});

/* ---------------- VIEW ENGINE ---------------- */
app.set('view engine', 'ejs');
app.set('views', 'views');

/* ---------------- STATIC FILES ---------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------------- BODY PARSER ---------------- */
app.use(express.urlencoded({ extended: false }));

/* ---------------- SESSION ---------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

/* ---------------- USER MIDDLEWARE ---------------- */
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) return next();
    const user = await User.findById(req.session.user._id);
    if (user) req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next();
  }
});

/* ---------------- LOCALS FOR EJS ---------------- */
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.user;
  next();
});

/* ---------------- ROUTES ---------------- */
app.use(storeRouter);
app.use('/host', hostRouter);
app.use(authRouter);

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    currentPage: '404',
  });
});

/* ---------------- DB + SERVER ---------------- */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed:', err);
  });
