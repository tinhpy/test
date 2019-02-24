const mongoose = require('mongoose');

const youtubeUpload = mongoose.Schema({
    link:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    user:{
        type: String,
        required: true
    },
    isCheck:{
        type: Boolean,
        default: false
    }
});

const ytbUpload = mongoose.model('ytbUpload', youtubeUpload);

module.exports = ytbUpload;