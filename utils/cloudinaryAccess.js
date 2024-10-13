const cloudinary = require('cloudinary').v2

module.exports = cloudinary.config({
    cloud_name: 'doxk9rj9s',
    api_key: process.env.cloud_key,
    api_secret: process.env.cloud_secret
});