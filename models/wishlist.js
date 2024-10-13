const mongoose = require('mongoose')
const validator = require('validator')
const ErrorHandler = require('../utils/errorHandler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Wishlist = new mongoose.Schema({
    wishlist_id:{
        type:String
    },
    userId:{
        type:String
    },
    wishlist_action:{
        type:String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
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
    shop_ads: {
        type: String,
    },
    type: {
        type: String
    },
    number:{
        type:Number
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
    type: {
        type: String,
    },
    category: {
        type: String,
    },
    screenshot: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount: {
        type: String,
    },
    channel_name: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now
    }

})



module.exports = mongoose.model('wishlist', Wishlist)