const express = require('express')
const route = express.Router()
const { adminAuth } = require('../middleware/auth')
const { addService, addAction } = require('../controllers/services')

// Events
route.post('/add', adminAuth, addService)
route.post('/action', adminAuth, addAction)


module.exports = route