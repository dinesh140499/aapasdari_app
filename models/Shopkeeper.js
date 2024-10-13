const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const shopkeeper = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed 40 characters"],
        minLength: [4, "Name should be more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
    },
    contact: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    shop_name: {
        type: String,
        required: true,
    },
    shop_ads: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    regular_price: {
        type: String,
        trim: true,
    },
    selling_price: {
        type: String,
        trim: true,
    },
    refer_code: {
        type: String,
    },
    reference_id: {
        type: String
    },
    type: {
        type: String,
        default: "shopkeeper"
    },
    number: {
        type: Number,
        default: 1
    },
    userId:{
        type:String
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

shopkeeper.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}



module.exports = mongoose.model('shopkeeper', shopkeeper)