const passport = require('passport');

module.exports = {
  login: (req, res, next) => {
      passport.authenticate('local', {
          successRedirect: '/dashboard',
          failureRedirect: '/users/login',
          failureFlash: true
      })(req, res, next);
  }
};