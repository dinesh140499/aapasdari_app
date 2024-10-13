const mongoose = require('mongoose')

const refer_codes = new mongoose.Schema({
    refer_code: {
        type: String
    },
    referred_id: {
        type: String,
    },
    userId: {
        type: String,
    },
    discount_price: {
        type: String,
        default: "20"
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('refer_codes', refer_codes)