const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const event = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    regular_price:{
        type:String,
        trim:true
    },
    selling_price:{
        type:String,
        trim:true
    },
    screenshot: [
        {
            type: String,
        }
    ],
    event_id: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('event', event)

