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

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

// 1. Serve 'public' folder (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
// 2. Serve 'uploads' folder (Images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// MIDDLEWARE 1: Find User from Session
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

// MIDDLEWARE 2: Pass User & Auth State to ALL Views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // 👇 THIS WAS MISSING. Add this line:
  res.locals.user = req.user; 
  next();
});

app.use(storeRouter);
app.use('/host', hostRouter);
app.use(authRouter);

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    currentPage: '404',
    isAuthenticated: req.session.isLoggedIn,
    user: req.user
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(4000, () => {
      console.log('Server running at http://localhost:4000');
    });
  })
  .catch((err) => {
    console.log(err);
  });