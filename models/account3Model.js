const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [4, "Name should be more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
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
        required: true
    },
    type: {
        type: String,
        default: "guest"
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
    regular_price: {
        type: String,
        trim: true,
    },
    selling_price: {
        type: String,
        trim: true,
    },
    number: {
        type: Number,
        default: 3
    },
    
    isVerified: {
        type: Boolean,
        default: false
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

Account.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}

module.exports = mongoose.model('account3Model', Account)