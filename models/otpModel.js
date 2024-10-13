const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const otp = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('otpModel', otp)

