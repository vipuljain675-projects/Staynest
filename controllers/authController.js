const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isLoggedIn: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  User.findOne({ email: email })
    .then(userDoc => {
      // If user already exists, redirect back to signup
      if (userDoc) {
        console.log("User already exists.");
        return res.redirect('/signup');
      }
      
      // If user is new, create them
      const user = new User({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      });
      
      return user.save()
        .then(result => {
          // Manually handle session data to prevent BSON crash
          req.session.user = {
            _id: result._id.toString(),
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName
          };
          req.session.isLoggedIn = true;
          
          return req.session.save(err => {
            if (err) console.log(err);
            res.redirect('/');
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/signup');
    });
};

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isLoggedIn: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      
      // Manually handle session data to prevent BSON crash
      req.session.user = {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      req.session.isLoggedIn = true;
      
      req.session.save(err => {
        if (err) console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
};