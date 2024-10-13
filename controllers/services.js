const catchAsyncError = require("../utils/catchAsyncError");
const upload = require('../utils/image-upload')
const Service = require('../models/serviceModel');
const ErrorHandler = require("../utils/errorHandler");

exports.addService = catchAsyncError(async (req, res, next) => {
    let image
    const { title, accType,type } = req.body
    const file = req.files && req.files.image;
    if (file) {
        image = await upload.imageUpload(file)
    }

    let service = await Service.findOne({
        $and: [
            {
                accType: accType,
                title: title
            }
        ]
    })

    if (service) {
        return next(new ErrorHandler("Service already Added", 400))
    }

    await Service.create({ title: title, accType: accType, type:type, image: file ? image.url : "" })
    res.json({
        success: true,
        message: 'service created'
    })
})

exports.addAction = catchAsyncError(async (req, res, next) => {
    const { title, accType, action, newTitle } = req.body

    if (!accType || !action) {
        return next(new ErrorHandler("Field Cannot Be Blank", 400))
    }

    if (action == 'update') {
        const file = req.files && req.files.image;
        let image = await upload.imageUpload(file)

        const service = await Service.findOne({
            $and: [
                { accType: accType },
                { title: title }
            ]
        })

        if (!service) {
            return next(new ErrorHandler("data not found", 400))
        }

        await Service.updateOne(service, { image: image.url, title: newTitle })
        return res.json({
            success: true,
            message: "Update Successfully"
        })
    }
    if (action == 'remove') {
        const service = await Service.findOne({
            $and: [{
                accType, title
            }]
        })
        if (!service) {
            return next(new ErrorHandler("data not found", 400))
        }

        await Service.deleteOne(service)
        return res.json({
            success: true,
            message: "delete successfully"
        })
    }
    else {
        return next(new ErrorHandler("You are providing wrong data", 400))
    }
})