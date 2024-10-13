const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Guest = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed 40 characters"],
        minLength: [4, "Name should be more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, "please enter valid email"],
        required: [true, "Enter Email Address"]

    },
    phone: {
        type: Number,
        required: true,
    },
    link: {
        type: String,
        required: true,
        select: false
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    type: {
        type: String,
    },
    number: {
        type: Number,
        default: 3
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
        default: ""
    },
    reference_id: {
        type: String
    },
    userId: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now
    }

})

// ServiceProvider.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next()
//     }
//     this.password = await bcrypt.hash(this.password, 10)

// })

Guest.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}



module.exports = mongoose.model('guest', Guest)