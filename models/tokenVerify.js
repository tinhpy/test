const mongoose = require('mongoose');

const token = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    token: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        require: true,
        default: Date.now,
        expires: 43200
    }

});

const Token = mongoose.model('Token',token);

module.exports = Token;