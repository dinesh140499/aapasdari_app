const { shopkeeperUser, shopOtpVerify } = require('../controllers/shopkeeper')
const { youtubeUser, youtubeOtpVerify } = require('../controllers/youtube')
const { guestUser, guestOtpVerify } = require('../controllers/guest')
const express = require('express')
const { userActivity } = require('../controllers/welcome')
const route = express.Router()

route.post('/shop/create', shopkeeperUser)
route.post('/shop/otp', shopOtpVerify)

route.post('/youtube/create', youtubeUser)
route.post('/youtube/otp', youtubeOtpVerify)

route.post('/guest/create', guestUser)
route.post('/guest/otp', guestOtpVerify)

// Timestamp
route.post('/timestamp',userActivity)

module.exports = route
