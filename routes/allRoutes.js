const express = require('express')
const route = express.Router()
const { welcome, wishlists, chooseService, userProfile, selectType, addToWishlist, pushNotification, pushNotificationAction,showNotification } = require('../controllers/welcome')
const { logout } = require('../controllers/logout')
const { login, profile, updateProfile, updateScreenshot } = require('../controllers/loginCommon')
const { userAuth } = require('../middleware/auth')

// Login System
route.post('/login', login)
route.get('/logout', logout)

// Profile Section
route.post('/welcome', welcome)
route.post('/welcome/choose', chooseService)
route.post('/welcome/userProfile', userProfile)
route.post('/welcome/selectType', userAuth, selectType)
route.post('/profile', userAuth, profile)
route.post('/update/profile', userAuth, updateProfile)
route.post('/update/screenshot', userAuth, updateScreenshot)

// Notifications
route.post('/offernotification', userAuth, pushNotification)
route.post('/offeraction', userAuth, pushNotificationAction)
route.post('/showNotification', userAuth, showNotification)

// Wishlist
route.post('/welcome/wishlist', userAuth, addToWishlist)
route.post('/wishlists', userAuth, wishlists)

module.exports = route