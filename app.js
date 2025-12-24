const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

// Import Routes
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/airbnb';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

// --- CRITICAL FIXES FOR IMAGES ---
// 1. Serve the 'public' folder (CSS, Logo)
app.use(express.static(path.join(__dirname, 'public')));
// 2. Serve the 'uploads' folder (User images)
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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(storeRouter);
app.use('/host', hostRouter);
app.use(authRouter);

app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isLoggedIn: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3600, () => {
      console.log('Server running at http://localhost:3600');
    });
  })
  .catch((err) => {
    console.log(err);
  });