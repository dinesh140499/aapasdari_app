const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed 40 characters"],
        minLength: [4, "Name should be more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Enter Email Address"]
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
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
    refer_code: {
        type: String,
    },
    refer_Exist: {
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
    regular_price: {
        type: String,
        trim: true,
    },
    selling_price: {
        type: String,
        trim: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    fcm_token: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },

})




module.exports = mongoose.model('account1Model', Account)

