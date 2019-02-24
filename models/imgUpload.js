const mongoose = require('mongoose');

const image = mongoose.Schema({
    loginName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    isCheck: {
        type: Boolean,
        default: false
    }
});

const imgUp = mongoose.model('imgUp', image);

module.exports = imgUp;