const loginModel = require("../models/loginModel");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require('../utils/catchAsyncError')


exports.logout = catchAsyncError(async (req, res,next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler("You cannot directly logout please login your account first", 400))
    }
    await loginModel.findOneAndUpdate({ tokenLogged: token }, { tokenLogged: "" })
    res.clearCookie("token");
    res.json({
        message: "you are logout successfully",
    });

})