const otpModel = require('../models/otpModel')
const bcrypt = require('bcrypt')
const Youtube = require('../models/Youtuber')
const fs = require('fs')
const AccountModel2 = require('../models/account2Model')
const LoginModel = require('../models/loginModel')
const upload = require('../utils/image-upload')
const ReferCodes = require('../models/refer_codes')
const referralCodeGenerator = require('referral-code-generator')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../utils/catchAsyncError')
let rawData = fs.readFileSync('static/welcome.json');
rawData = JSON.parse(rawData)

// Otp Generator Function
function generateOTP(length) {
    const characters = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    return otp;
}

exports.youtubeUser = catchAsyncError(async (req, res, next) => {

    const otp = generateOTP(4);
    let refer = referralCodeGenerator.alpha('lowercase', 6)

    const { name, email, phone, regular_price, selling_price, channel_name, link, description, address, password, cpassword, refer_code } = req.body
    if (!name || !email || !phone || !regular_price || !selling_price || !link || !channel_name || !description || !address || !password || !cpassword) {
        return next(new ErrorHandler("field cannot be blank", 404))
    }

    if (password !== cpassword) {
        return next(new ErrorHandler("Password And Confirm Password is not Match", 400))
    }

    const loginExist = await LoginModel.findOne({ email })
    const numberExist = await otpModel.findOne({ phone })
    const account2 = await AccountModel2.findOne({ phone })

    if (loginExist) {
        return next(new ErrorHandler("This Email Already Ready Registered", 400))
    }

    if (refer_code) {
        const referExist = await LoginModel.findOne({ refer_code: refer_code })

        if (!referExist) {
            return next(new ErrorHandler("refer_code not exist", 400))
        }

        if (referExist) {
            if (account2) {
                if (account2.isVerified) {
                    return next(new ErrorHandler("This number is already verified", 400))
                }
                if (!account2.isVerified) {
                    await otpModel.findByIdAndDelete(numberExist)
                    await AccountModel2.findByIdAndDelete(account2)
                    const encryptOtp = await bcrypt.hash(otp, 10)

                    await otpModel.create({
                        phone,
                        otp: encryptOtp
                    })
                    await AccountModel2.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, channel_name, link, description, address, password, cpassword, refer_code: refer, refer_Exist: refer_code, reference_id: referExist.userId })
                    return res.json({
                        success: true,
                        message: "otp sent to your number",
                        otp
                    }).status(200)
                }
            }
            if (!account2) {
                await otpModel.findByIdAndDelete(numberExist)
                const encryptOtp = await bcrypt.hash(otp, 10)
                await otpModel.create({
                    phone,
                    otp: encryptOtp
                })
                await AccountModel2.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, channel_name, link, description, address, password, cpassword, refer_code: refer, reference_id: referExist.userId, refer_Exist: refer_code })

                return res.json({
                    success: true,
                    message: "otp sent to your number",
                    otp,
                    refer_code: refer
                }).status(200)
            }
        }
    } else {
        if (account2) {
            if (account2.isVerified) {
                return next(new ErrorHandler("This number is already verified", 400))
            }
            if (!account2.isVerified) {
                await otpModel.findByIdAndDelete(numberExist)
                await AccountModel2.findByIdAndDelete(account2)
                const encryptOtp = await bcrypt.hash(otp, 10)

                await otpModel.create({
                    phone,
                    otp: encryptOtp
                })
                await AccountModel2.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, channel_name, link, description, address, password, cpassword, refer_code: refer })
                return res.json({
                    success: true,
                    message: "otp sent to your number",
                    otp
                }).status(200)
            }
        }
        if (!account2) {
            await otpModel.findByIdAndDelete(numberExist)
            const encryptOtp = await bcrypt.hash(otp, 10)
            await otpModel.create({
                phone,
                otp: encryptOtp
            })
            await AccountModel2.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, channel_name, link, description, address, password, cpassword, refer_code: refer })

            return res.json({
                success: true,
                message: "otp sent to your number",
                otp,
                refer_code: refer
            }).status(200)
        }
    }


})

exports.youtubeOtpVerify = catchAsyncError(async (req, res, next) => {
    const { phone, otp } = req.body

    if (!phone || !otp) {
        return next(new ErrorHandler("field cannot be blank", 400))
    }

    const isMatch = await otpModel.findOne({ phone: phone })
    if (!isMatch) {
        return next(new ErrorHandler("number is not valid", 400))
    }

    const otpMatch = await bcrypt.compare(otp, isMatch.otp)
    if (!otpMatch) {
        return next(new ErrorHandler("invalid otp", 400))
    }

    await AccountModel2.findOneAndUpdate({ phone }, { isVerified: true });
    let isVerified = await AccountModel2.findOne({ phone: phone })
    const pass = await bcrypt.hash(isVerified.password, 10)
    const cpass = await bcrypt.hash(isVerified.cpassword, 10)


    if (isVerified) {
        const user = await Youtube.create({ name: isVerified.name, email: isVerified.email, phone: isVerified.phone, regular_price: isVerified.regular_price, selling_price: isVerified.selling_price, channel_name: isVerified.channel_name, link: isVerified.link, description: isVerified.description, address: isVerified.address, password: pass, cpassword: cpass, screenshot_1: isVerified.screenshot_1, screenshot_2: isVerified.screenshot_2, screenshot_3: isVerified.screenshot_3, screenshot_4: isVerified.screenshot_4, screenshot_5: isVerified.screenshot_5, refer_code: isVerified.refer_code, userId: isVerified._id, reference_id: isVerified.reference_id })

        let createdAccount = await LoginModel.create({ name: isVerified.name, email: isVerified.email, phone: isVerified.phone, regular_price: isVerified.regular_price, selling_price: isVerified.selling_price, channel_name: isVerified.channel_name, link: isVerified.link, description: isVerified.description, address: isVerified.address, password: pass, cpassword: cpass, type: isVerified.type, screenshot_1: isVerified.screenshot_1, screenshot_2: isVerified.screenshot_2, screenshot_3: isVerified.screenshot_3, screenshot_4: isVerified.screenshot_4, screenshot_5: isVerified.screenshot_5, refer_code: isVerified.refer_code, userId: user.userId, reference_id: isVerified.reference_id })

        if (user.reference_id) {
            await ReferCodes.create({ userId: user.userId, refer_code: isVerified.refer_Exist, referred_id: user.reference_id })
        }

        // Account 2 Model Delete
        await AccountModel2.deleteOne(isVerified)
    }

    res.json({
        success: true,
        message: "Successfully Verified",
        id: isMatch._id,
    }).status(200)
})