const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const youtuber = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed 40 characters"],
        minLength: [4, "Name should be more than 4 characters"],
        trim: true
    },
    email: {
        trim: true,
        type: String,
        required: [true, "Enter Email Address"],
        validate: [validator.isEmail, "please enter valid email"],
    },
    phone: {
        type: Number,
        trim: true,
        required: true,
        minLength: 10,
    },
    regular_price: {
        type: String,
        trim: true,
    },
    selling_price: {
        type: String,
        trim: true,
    },
    channel_name: {
        type: String,
        trim: true,
        required: true,
    },
    link: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        select: false
    },
    cpassword: {
        type: String,
        trim: true,
        required: true,
        select: false
    },
    type: {
        type: String,
        default: "youtube"
    },
    number: {
        type: Number,
        default: 2
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
    reference_id: {
        type: String
    },
    userId: {
        type: String,
    },
    refer_code: {
        type: String,
        default: ""
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

youtuber.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

youtuber.pre('save', async function (next) {
    if (!this.isModified('cpassword')) {
        next()
    }
    this.cpassword = await bcrypt.hash(this.cpassword, 10)
})

youtuber.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}



module.exports = mongoose.model('youtuber', youtuber)