const express = require('express')
const route = express.Router()
const { adminCreate, adminLogin, adminLogout, adminWelcome, deleteUser, allUser } = require('../controllers/admin')
const { shopkeeperUser, youtubeUser, guestUser, adminCreateEvent } = require('../controllers/admin')
const { adminAuth } = require('../middleware/auth')
const { addService, addAction } = require('../controllers/services')


// Admin Create
route.post('/', adminCreate)

// // Events
// route.post('/event_create', adminCreateEvent)
// route.get('/events', adminEvents)
// route.delet('/deletevents', deleteEvent)

// Admin Login Logout
route.post('/login', adminLogin)
route.get('/logout', adminAuth, adminLogout)

// Admin Panel
route.get('/welcome', adminAuth, adminWelcome)
route.get('/allusers', adminAuth, allUser)
route.get('/shopkeeper', adminAuth, shopkeeperUser)
route.get('/youtube', adminAuth, youtubeUser)
route.get('/guest', adminAuth, guestUser)
route.delete('/userid/:id', adminAuth, deleteUser)

// Events
route.post('/add', adminAuth, addService)
route.post('/action', adminAuth, addAction)


module.exports = route