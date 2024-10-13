const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


const admin = new mongoose.Schema({
    name: String,
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "admin"
    },
    adminToken: String,
    screenshot: {
        type: String,
        default: "empty"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

admin.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}

module.exports = mongoose.model('admin', admin)