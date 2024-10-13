const express = require('express')
const route = express.Router()
const { adminCreateEvent, adminEvents, deleteEvent, adminUpdateEvent,viewEvent } = require('../controllers/admin')
const { userAuth, adminAuth } = require('../middleware/auth')



// Events
route.get('/', userAuth, adminEvents)
route.get('/:id', userAuth, viewEvent)
route.post('/create', adminAuth, adminCreateEvent)
route.delete('/userid/:id', adminAuth, deleteEvent)
route.put('/userid/:id', adminAuth, adminUpdateEvent)



module.exports = route