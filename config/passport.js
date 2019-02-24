const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'loginName', passwordField: 'password' }, (username, password, done) => {
      // Match user
      User.findOne({
        loginName: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Tài khoản chưa đăng ký' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            if(!user.isVerified)
              return done(null, false, {message: 'Tài khoản chưa được xác thực'});
            return done(null, user);
          } else {
            return done(null, false, { message: 'Mật khẩu không đúng' });
          }

        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
