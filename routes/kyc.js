const express = require('express');
const multer = require('multer');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const imgUp = require('../models/imgUpload');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/unchecked')
    },
    filename: function (req, file, cb) {
        cb(null,req.user.loginName + '-' + Date.now() + '-' + file.originalname);
    }
});


var upload = multer({ storage: storage }).array('img',3);


router.get('/kyc',ensureAuthenticated, (req, res) => {res.render('upload')});

router.post('/kyc',ensureAuthenticated, function (req,res) {
    upload(req,res,(err)=>{
        if(err)  req.flash('error' , 'Tải lên lỗi. Tối đa 3 ảnh' );
        else
            req.flash('success_msg', 'Upload thành công. Vui lòng chờ admin duyệt');
            res.redirect('/user/kyc');
    });

    const map = req.files.map(x=>{
        var loginName = req.user.loginName;
        var filename = x.filename;
        const newImgUp = new imgUp({
            loginName,
            filename
        });
        newImgUp.save();
    })
});


module.exports = router;