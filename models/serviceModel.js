const mongoose = require('mongoose')

const service = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
    type: {
        type: String
    },
    accType: {
        type: String
    },
    role: {
        type: String,
        default: "admin"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('service', service)