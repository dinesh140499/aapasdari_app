const mongoose = require('mongoose')

const activity = new mongoose.Schema({
    action: String,
    timestamp: Date,
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('userActivity', activity)