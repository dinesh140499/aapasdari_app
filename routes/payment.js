const express = require('express')
const route = express.Router()
const { paymentGateway } = require('../controllers/paymentGateway')

const { userAuth } = require('../middleware/auth')

// Payment Gateway
route.post('/gateway', userAuth, paymentGateway)

module.exports = route