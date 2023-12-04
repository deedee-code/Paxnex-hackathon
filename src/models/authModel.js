const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8
    },
    nationality: {
        type: String,
    },
    dateOfBirth: {
        type: String
    },
    country: {
        type: String,
        maxlength: 50
    },
    state: {
        type: String,
    },
    address: {
        type: String,
        trim: true,
        maxlength: 255
    },
    tag: {
        type: String,
        trim: true,
        maxlength: 255
    },
    bvn: {
        type: Number,
        trim: true,
        maxlength: 50
    },
    pin: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)