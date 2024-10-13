const mongoose = require('mongoose')

const pushNotification = new mongoose.Schema({
    userId: {
        type: String
    },
    profile_Id: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    refer_code: {
        type: String,
    },
    type: {
        type: String
    },
    offer: {
        type: String,
    },
    action: {
        type: String,
        enum: ['accepted', 'rejected','not-confirmed'],
    },
    createAt: {
        type: Date,
        default: Date.now
    }

})



module.exports = mongoose.model('pushNotification', pushNotification)