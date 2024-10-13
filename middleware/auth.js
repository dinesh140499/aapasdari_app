const jwt = require('jsonwebtoken')
const loginModel = require('../models/loginModel')
const catchAsyncError = require('../utils/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const Admin = require('../models/admin')


exports.userAuth = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler("login to your account", 400))
    }
    let decoded = await jwt.verify(token, process.env.JWT_SECRET)
    await loginModel.findById(decoded.id)

    next()

})

exports.adminAuth = catchAsyncError(async (req, res, next) => {
    const { admin } = req.cookies
    if (!admin) {
        return next(new ErrorHandler("login to your account", 400))
    }
    let decoded = await jwt.verify(admin, process.env.JWT_SECRET)
    await Admin.findById(decoded.id)
    next()
})