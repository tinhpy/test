const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');
const Token = require('../models/tokenVerify')


module.exports = {
    register: (req, res) => {
        const {firstName, surName, loginName, password, rePassword, birthday, gender} = req.body;
        let errors = [];

        if (!firstName || !surName || !password || !loginName || !birthday || !gender) {
            errors.push({msg: 'Vui lòng nhập đủ thông tin'});
        }
        if (password !== rePassword) {
            errors.push({msg: 'Mật khẩu nhập lại không đugns'})
        }
        if (password.length < 6) {
            errors.push({msg: 'Mật khẩu tối thiểu 6 kí tự'});
        }

        if (loginName)

            if (errors.length > 0) {
                res.render('register', {
                    errors,
                    firstName,
                    surName,
                    loginName,
                    password,
                    birthday,
                    gender
                });
            } else {
                User.findOne({loginName: loginName}).then(user => {
                    if (user) {
                        errors.push({msg: 'Email or phone already exists'});
                        res.render('register', {
                            errors,
                            firstName,
                            surName,
                            loginName,
                            password,
                            birthday,
                            gender
                        });
                    } else {
                        const newUser = new User({
                            firstName,
                            surName,
                            loginName,
                            password,
                            birthday,
                            gender
                        });


                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        var token = new Token({
                                            _userId: user._id,
                                            token: crypto.randomBytes(16).toString('hex')
                                        });
                                        token.save();
                                        var transporter = nodemailer.createTransport({
                                            service: 'Gmail',
                                            auth: {user: 'tinhpy2017@gmail.com', pass: '850256850141'}
                                        });
                                        var mailOptions = {
                                            from: 'tinhpy2017@gmail.com',
                                            to: user.loginName,
                                            subject: 'Account Verification Token',
                                            html: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users/confirmation?token=' + token.token + '&email=' + user.loginName + '.\n'
                                        };
                                        transporter.sendMail(mailOptions, function (err) {
                                            if (err) {
                                                return res.status(500).send({msg: err.message});
                                            }
                                            res.status(500).send('A verification email has been sent to ' + user.loginName + '.');
                                        });
                                        req.flash(
                                            'success_msg',
                                            'You are now registered and can log in'
                                        );
                                        res.redirect('/users/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }
    },
    verify: (req, res) => {
        User.findOne({loginName: req.query.email})
            .then(user => {
                if (user.isVerified) {
                    req.flash('success_msg', 'Email Already Verified');
                    res.redirect('/users/login');
                } else {
                    return Token.find({where: {token: req.query.token}})
                        .then(foundToken => {
                            if (foundToken) {
                                return User.update({isVerified: true})
                                    .then(updateUser => {
                                        req.flash('success_msg', 'Tài khoản đã xác thực');
                                        res.redirect('/users/login');
                                    })
                                    .catch(reason => {
                                        req.flash('error', 'Xác thực lỗi');
                                        res.redirect('/users/login');
                                    });
                            } else {
                                req.flash('error', 'Token hết hạn');
                                res.redirect('/users/login');
                            }
                        })
                        .catch(reason => {
                            req.flash('error', 'Token hết hạn');
                            res.redirect('/users/login');
                        })
                }
            })
            .catch(reason => {
                req.flash('error', 'Email not found');
                res.redirect('/users/login');
            });
    }
};