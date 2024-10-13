const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Account2 = new mongoose.Schema({
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
        required:[true,"Enter Email Address"],
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
    },
    address: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    cpassword: {
        type: String,
        trim: true,
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
        default: ""
    },
    screenshot_2: {
        type: String,
        default: ""
    },
    screenshot_3: {
        type: String,
        default: ""
    },
    screenshot_4: {
        type: String,
        default: ""
    },
    screenshot_5: {
        type: String,
        default: ""
    },
    refer_code:{
        type:String,
    },
    refer_Exist:{
        type:String,
    },
    reference_id:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    userId: {
        type: String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    
})


module.exports = mongoose.model('account2Model', Account2)