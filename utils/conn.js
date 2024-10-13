const mongoose = require('mongoose')

module.exports = mongoose.connect(process.env.DB, {
    dbName: "aapasdari"
}).then(() => {
    console.log("database connected 🥰")
}).catch(() => console.log("database not connected 😢"))