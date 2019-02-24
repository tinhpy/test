const express = require('express');
const router = express.Router();

const reg = require('../controller/register');
const log = require('../controller/login')

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register
router.post('/register', reg.register);

// Verify
router.get('/confirmation', reg.verify);

// Login
router.post('/login', log.login);

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});



module.exports = router;
