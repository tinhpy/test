const express = require('express');
const router = express.Router();
const kyc = require('./kyc.js');

const  User = require('../models/user');
const imgUp = require('../models/imgUpload');
const ytbUpload = require('../models/youtubeUpload');



router.get('/',(req,res) => res.render('admin/dashboard'));
router.get('/kyc',(req,res) =>{
   User.find({isVerified: true}, (err,user)=>{
      if(err){
         console.log(err);
      }else {
          console.log(user);
          res.render('admin/kyc', {user: user})
      }
   });
}) ;

router.post('/kyc', (req, res) =>{
    console.log(req);
});

router.get('/post', (req,res)=>{
    ytbUpload.find({isCheck: true},(err, link)=>{
        if(err){
            console.log(err);
        }else {

            res.render('admin/post', {upload: link});
        }
    });
});

module.exports = router;