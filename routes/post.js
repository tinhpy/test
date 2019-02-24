const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ytbUpload = require('../models/youtubeUpload');


router.get('/post.ejs', ensureAuthenticated, (req,res)=> {res.render('post')});

router.post('/post.ejs', ensureAuthenticated, (req, res)=>{
    console.log(req);
    const upload = new ytbUpload({
        link: req.body.link,
        category: req.body.category,
        subject: req.body.subject,
        description: req.body.description,
        user: req.user.loginName
    });
    upload.save();
    req.flash('success_msg', 'Đã gửi. Vui lòng chờ admin duyệt');
    res.redirect('/users/post.ejs');
});

module.exports = router;