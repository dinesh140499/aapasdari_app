const LoginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')
const notification = require('../utils/sendNotification')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../utils/catchAsyncError')
const Shopkeeper = require('../models/Shopkeeper')
const Youtube = require('../models/Youtuber')
const Guest = require('../models/Guest')
const upload = require('../utils/image-upload')

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("field cannot be blank", 400))
    }
    const user = await LoginModel.findOne({ email })

    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 400))
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.json({
            success: false,
            message: "Invalid Credentials"
        }).status(400)
    }

    let token = user.getJWTToken()

    res.cookie('user', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    await LoginModel.findOneAndUpdate({ userId: user.userId }, { tokenLogged: token })

    res.json({
        success: true,
        message: "login successfully",
        user,
        token:token
    }).status(200)

})

exports.profile = catchAsyncError(async (req, res, next) => {
    const { id } = req.body
    const user = await LoginModel.findById(id)
    if (!user) {
        return next(new ErrorHandler("this user profile doesn't exist", 400))
    }
    res.json({
        success: true,
        data: user
    }).status(200)
})

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let { userId, name, previous_password, newPassword, shop_name, shop_ads, phone, type, category, link, description, address, regular_price, selling_price, discount, channel_name, password, cpassword, newCPassword } = req.body
    const user = await LoginModel.findOne({ userId: userId })

    if (!user) {
        return next(new ErrorHandler("this user profile doesn't exist", 400))
    }

    if (newPassword) {
        const isMatch = await bcrypt.compare(previous_password, user.password)
        if (!isMatch) {
            return next(new ErrorHandler("password doesn't match", 400))
        }
        password = await bcrypt.hash(newPassword, 10)
    }

    if (cpassword) {
        if (cpassword !== newPassword) {
            return next(new ErrorHandler("confirm password not match", 400))
        }
        const isMatch = await bcrypt.compare(previous_password, user.cpassword)
        if (!isMatch) {
            return next(new ErrorHandler("password doesn't match", 400))
        }
        newCPassword = await bcrypt.hash(cpassword, 10)
    }

    await LoginModel.updateOne({ userId: userId }, { name, password: password, shop_name, shop_ads, type, phone, link, description, address, regular_price, selling_price, discount, channel_name })
    const shopUser = await Shopkeeper.findOne({ userId: userId })
    const youtubeUser = await Youtube.findOne({ userId: userId })
    const guestUser = await Guest.findOne({ userId: userId })

    if (shopUser || youtubeUser || guestUser) {
        if (shopUser) {
            await Shopkeeper.updateOne({ userId: userId }, { name, contact: phone, shop_name, password: password, shop_ads, regular_price, selling_price })
        }
        if (youtubeUser) {
            await Youtube.updateOne({ userId: userId }, {
                name, phone: phone, channel_name, link,
                description: description, address: address,
                password: password, regular_price, selling_price, cpassword: newCPassword
            })
        }
        if (guestUser) {
            await Guest.updateOne({ userId: userId }, { name, phone: phone, link, description, address, regular_price, selling_price })
        }
    }


    res.json({
        success: true,
        message: "profile update successfully"
    }).status(200)
})

exports.updateScreenshot = catchAsyncError(async (req, res, next) => {
    const { userId, screenshot_1, screenshot_2, screenshot_3, screenshot_4, screenshot_5 } = req.body
    const user = await LoginModel.findOne({ userId: userId })
    let screen1=req.files.screenshot_1;
    let screen2=req.files.screenshot_2;
    let screen3=req.files.screenshot_3;
    let screen4=req.files.screenshot_4;
    let screen5=req.files.screenshot_5;
    
    if (!user) {
        return next(new ErrorHandler("user not found", 400))
    }
    if (screen1) {
        screen1 = await upload.imageUpload(screen1)
    }
    if (screen2) {
        screen2 = await upload.imageUpload(screen2)
    }
    if (screen3) {
        screen3 = await upload.imageUpload(screen3)
    }
    if (screen4) {
        screen4 = await upload.imageUpload(screen4)
    }
    if (screen5) {
        screen5 = await upload.imageUpload(screen5)
    }

    await LoginModel.updateOne({ userId: user.userId }, { screenshot_1: screen1?.url, screenshot_2: screen2?.url, screenshot_3: screen3?.url, screenshot_4: screen4?.url, screenshot_5: screen5?.url })
    await Youtube.updateOne({ userId: user.userId }, { screenshot_1: screen1?.url, screenshot_2: screen2?.url, screenshot_3: screen3?.url, screenshot_4: screen4?.url, screenshot_5: screen5?.url })

    res.json({
        success: true,
        message: "screenshot update"
    })
})