const ErrorHandler = require('../utils/errorHandler')
const otpModel = require('../models/otpModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Shopkeeper = require('../models/Shopkeeper')
const Guest = require('../models/Guest')
const fs = require('fs')
const ReferCodes = require('../models/refer_codes')
const Youtube = require('../models/Youtuber')
const AccountModel = require('../models/account3Model')
const LoginModel = require('../models/loginModel')
const upload = require('../utils/image-upload')
const referralCodeGenerator = require('referral-code-generator')
const catchAsyncError = require('../utils/catchAsyncError')



// const serviceType=require('../static/welcome.json')

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

exports.guestUser = catchAsyncError(async (req, res, next) => {
    const otp = generateOTP(4);
    let refer = referralCodeGenerator.alpha('lowercase', 6)
    // const file = req.files && req.files.screenshot;
    // if (!file) {
    //     return next(new ErrorHandler("Screenshot file not provided", 400))
    // }
    // let image = await upload.imageUpload(file)
    const { name, email, phone, password, regular_price, selling_price, description, link, address, refer_code } = req.body

    if (!name || !email || !link || !phone || !password || !selling_price || !description || !address) {
        return next(new ErrorHandler("Field Cannot be Blank", 400))
    }

    // const loginExist = await LoginModel.findOne({ phone })
    const loginExist = await LoginModel.findOne({ email })
    const numberExist = await otpModel.findOne({ phone })
    const account2 = await AccountModel.findOne({ phone })

    if (loginExist) {
        return next(new ErrorHandler("This email already registered", 400))
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
                    await AccountModel.findByIdAndDelete(account2)
                    const encryptOtp = await bcrypt.hash(otp, 10)

                    await otpModel.create({
                        phone,
                        otp: encryptOtp
                    })
                    await AccountModel.create({
                        name, email, phone, password, link,
                        selling_price: selling_price, regular_price: regular_price, description, address, refer_code: refer, reference_id: referExist.userId,
                        refer_Exist: refer_code
                    })
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
                await AccountModel.create({
                    name, email, phone, password, link,
                    selling_price: selling_price, regular_price: regular_price, description, address, refer_code: refer, reference_id: referExist.userId,
                    refer_Exist: refer_code
                })

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
                await AccountModel.findByIdAndDelete(account2)
                const encryptOtp = await bcrypt.hash(otp, 10)

                await otpModel.create({
                    phone,
                    otp: encryptOtp
                })
                await AccountModel.create({
                    name, email, phone, password, link,
                    selling_price: selling_price, regular_price: regular_price, description, address,
                    refer_code: refer
                })
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
            await AccountModel.create({
                name, email, phone, password, link,
                selling_price: selling_price, regular_price: regular_price, description, address,
                refer_code: refer
            })

            return res.json({
                success: true,
                message: "otp sent to your number",
                otp,
                refer_code: refer
            }).status(200)
        }
    }
})

exports.guestOtpVerify = catchAsyncError(async (req, res, next) => {

    const { phone, otp } = req.body

    const isMatch = await otpModel.findOne({ phone: phone })
    if (!isMatch) {
        return next(new ErrorHandler("Number is not valid", 400))
    }

    const otpMatch = await bcrypt.compare(otp, isMatch.otp)
    if (!otpMatch) {
        return next(new ErrorHandler("Invalid Otp", 400))
    }

    await AccountModel.findOneAndUpdate({ phone }, { isVerified: true });
    let isVerified = await AccountModel.findOne({ phone: phone })

    if (isVerified) {
        const pass = await bcrypt.hash(isVerified.password, 10)

        const user = await Guest.create({
            name: isVerified.name, email: isVerified.email, phone: isVerified.phone, password: pass, link: isVerified.link,
            address: isVerified.address, type: isVerified.type, description: isVerified.description, selling_price: isVerified.selling_price, regular_price: isVerified.regular_price, screenshot: isVerified.screenshot, refer_code: isVerified.refer_code, userId: isVerified._id, reference_id: isVerified.reference_id
        })

        
        let createdAccount = await LoginModel.create({
            name: isVerified.name, email: isVerified.email, phone: isVerified.phone, password: pass, link: isVerified.link,
            address: isVerified.address, description: isVerified.description, type: isVerified.type, selling_price: isVerified.selling_price, regular_price: isVerified.regular_price, screenshot: isVerified.screenshot, refer_code: isVerified.refer_code, userId: user.userId, reference_id: isVerified.reference_id
        })

        if (user.reference_id) {
            await ReferCodes.create({ userId: user.userId, refer_code: isVerified.refer_Exist, referred_id: user.reference_id })
        }

        // Account 2 Model Delete
        await AccountModel.deleteOne(isVerified)
    }
    res.json({
        success: true,
        message: "Successfully Verified",
        id: isMatch._id,
    }).status(200)
})





