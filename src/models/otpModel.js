const mongoose = require('mongoose')

const Schema = mongoose.Schema

const otpCodeSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otpCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    },
})


module.exports = mongoose.model('OTPCode', otpCodeSchema)