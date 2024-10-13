const catchAsyncError = require('../utils/catchAsyncError')
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../utils/errorHandler')
const Shopkeeper = require('../models/Shopkeeper')
const Youtuber = require('../models/Youtuber')
const Visitor = require('../models/VisitingTime')
const Guest = require('../models/Guest')
const loginModel = require('../models/loginModel')
const Payment_Details = require('../models/Payment_Details')
const Event = require('../models/event')
const upload = require('../utils/image-upload')

// Login Logout 
exports.adminCreate = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await Admin.findOne({ email })
    if (user) {
        return next(new ErrorHandler("This email already exist.", 400))
    }

    const pass = await bcrypt.hash(password, 10)
    await Admin.create({ name: name, email: email, password: pass })

    res.json({
        success: true,
        message: "admin created"
    })
})

exports.adminLogin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    const user = await Admin.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Invalid User", 400))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return next(new ErrorHandler("Invalid User", 400))
    }

    if (user.token) {
        res.json({
            success: true,
            id: user._id
        })
    }

    const token = user.getJWTToken()

    await Admin.findOneAndUpdate({ email: email }, { adminToken: token })

    res.cookie('admin', token, {
        httpOnly: !Boolean(process.env.IS_DEV_ENV),
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        secure: true,
    })


    res.json({
        success: true,
        id: user._id,
        token: token
    })

})

exports.adminLogout = catchAsyncError(async (req, res, next) => {
    const { admin } = req.cookies
    if (!admin) {
        return next(new ErrorHandler("You cannot directly logout please login your account first", 400))
    }
    await Admin.findOneAndUpdate({ adminToken: admin }, { adminToken: "" })

    res.clearCookie("admin");
    res.json({
        message: "you are logout successfully",
    });

})

// ************************************

// Admin Panel Welcome
exports.adminWelcome = catchAsyncError(async (req, res, next) => {
    const totalCount = await loginModel.countDocuments()
    const shopkeeper = await Shopkeeper.countDocuments()
    const youtube = await Youtuber.countDocuments()
    const guest = await Guest.countDocuments()
    const visitor = await Visitor.countDocuments()
    const payment = await Payment_Details.countDocuments()
    const paymentTotal = await Payment_Details.find()
    const event = await Event.countDocuments()
    const TotalAmount = paymentTotal.reduce((total, payment) => total + payment.amount, 0)

    res.json({
        success: true,
        data: {
            total_users: totalCount,
            total_shopkeepers: shopkeeper,
            total_youtubers: youtube,
            total_guest: guest,
            visitors: visitor,
            event: event,
            payment: {
                count: payment,
                total_amount: `${TotalAmount}₹`
            }
        }
    })
})

exports.allUser = catchAsyncError(async (req, res, next) => {
    const users = await loginModel.find(req.query)
    if (users.length <= 0) {
        return next(new ErrorHandler('empty list', 400))
    }

    res.status(200).json({
        success: true,
        data: users
    })
})

exports.shopkeeperUser = catchAsyncError(async (req, res, next) => {
    const users = await Shopkeeper.find()
    if (users.length <= 0) {
        return next(new ErrorHandler('empty list', 400))
    }
    res.json({
        success: true,
        data: users
    })
})

exports.youtubeUser = catchAsyncError(async (req, res, next) => {
    const users = await Youtuber.find()
    if (users.length <= 0) {
        return next(new ErrorHandler('empty list', 400))
    }
    res.json({
        success: true,
        data: users
    })
})

exports.guestUser = catchAsyncError(async (req, res, next) => {
    const users = await Guest.find()
    if (users.length <= 0) {
        return next(new ErrorHandler('empty list', 400))
    }

    res.json({
        success: true,
        data: users
    })
})

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const user = await loginModel.findOneAndDelete({ userId: id })
    if (!user) {
        return next(new ErrorHandler("user not found", 400))
    }

    if (user.type == 'shopkeeper') {
        await Shopkeeper.deleteOne({ userId: user.userId })
        return res.json({
            success: true,
            message: "user deleted"
        })
    }
    else if (user.type == 'youtube') {
        await Youtuber.deleteOne({ userId: user.userId })
        return res.json({
            success: true,
            message: "user deleted"
        })
    } else {
        await Guest.deleteOne({ userId: user.userId })
        return res.json({
            success: true,
            message: "user deleted"
        })
    }

})

// Events
exports.adminCreateEvent = catchAsyncError(async (req, res, next) => {
    const { name, location, type, desc, selling_price, regular_price } = req.body
    if (!name || !location || !type || !selling_price || !regular_price) {
        return next(new ErrorHandler("Field cannot be blank", 400))
    }
    const data = []
    const file = req.files && req.files.screenshot;

    const image = await upload.imageUpload(file);

    const event = await Event.create({ name, location, type, screenshot: image.url, desc: desc, selling_price: selling_price, regular_price: regular_price });
    await Event.findByIdAndUpdate(event._id, { event_id: event._id });

    res.json({
        success: true,
        message: "event created"
    })
})

exports.adminUpdateEvent = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const user = await Event.findOne({ event_id: id })

    if (!user) {
        return next(new ErrorHandler("user id not exist", 400))
    }

    const { name, location, type, desc, selling_price, regular_price } = req.body

    const file = req.files && req.files.screenshot;
    let image = await upload.imageUpload(file)

    await Event.updateOne(user, { name: name, location: location, type: type, screenshot: image, desc: desc, selling_price: selling_price, regular_price: regular_price })

    res.json({
        success: true,
        message: "event updated successfully"
    })
})

exports.adminEvents = catchAsyncError(async (req, res, next) => {
    const events = await Event.find(req.query)
    res.json({
        success: true,
        data: events
    })
})

exports.viewEvent = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const event = await Event.findOne({ event_id: id })
    if (!event) {
        return next(new ErrorHandler("Invalid User", 400))
    }
    res.json({
        success: true,
        data: event
    }).status(200)
})

exports.deleteEvent = catchAsyncError(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
        return next(new ErrorHandler("event not found",400))
    }

    res.json({
        success: true,
        data: event
    })
})

