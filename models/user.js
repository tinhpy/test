const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    loginName:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    img:{
        type: []
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;