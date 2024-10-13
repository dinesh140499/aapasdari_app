const cloudinary = require('cloudinary').v2
const fs = require("fs")

exports.imageUpload = async (files) => {
    cloudinary.config({
        cloud_name: 'doxk9rj9s',
        api_key: process.env.cloud_key,
        api_secret: process.env.cloud_secret
    });
    try {
        const data = []
        
        const result = await cloudinary.uploader.upload(files.tempFilePath);
        return result;
    } catch (err) {
        console.log(err)
        return err;
    }
};


