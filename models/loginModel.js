
const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginModel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    cpassword: {
        type: String,
    },
    phone: {
        type: String,
    },
    shop_name: {
        type: String,
    },
    refer_code: {
        type: String,
    },
    reference_id: {
        type: String
    },
    shop_ads: {
        type: String,
    },
    type: {
        type: String
    },
    number: {
        type: Number
    },
    link: {
        type: String,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
    },
    category: {
        type: String,
    },
    screenshot: {
        type: String,
    },
    screenshot_1: {
        type: String,
    },
    screenshot_2: {
        type: String,
    },
    screenshot_3: {
        type: String,
    },
    screenshot_4: {
        type: String,
    },
    screenshot_5: {
        type: String,
    },
    regular_price: {
        type: String,
    },
    selling_price: {
        type: String,
    },
    channel_name: {
        type: String,
    },
    fcm_token: {
        type: String
    },
    userId: {
        type: String,
    },
    wishlist_action: {
        type: Boolean,
        default: false
    },
    wishlist_id: {
        type: String,
    },
    tokenLogged: {
        type: String,
        ref: "logged"
    },
    createAt: {
        type: Date,
        default: Date.now
    },

})

// shopkeeper.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next()
//     }
//     this.password = await bcrypt.hash(this.password, 10)
// })

loginModel.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}

module.exports = mongoose.model('loginModel', loginModel)