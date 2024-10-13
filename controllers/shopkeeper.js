const ShopKeeper = require('../models/Shopkeeper')
const otpModel = require('../models/otpModel')
const AccountModel = require('../models/account1Model')
const bcrypt = require('bcrypt')
const fs = require('fs')
const LoginModel = require('../models/loginModel')
const upload = require('../utils/image-upload')
const ReferCodes = require('../models/refer_codes')
const referralCodeGenerator = require('referral-code-generator')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../utils/catchAsyncError')
let rawData = fs.readFileSync('static/welcome.json');
rawData = JSON.parse(rawData)
const phoneOtpSend = require('../utils/sendOtp')



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

// Discount Function regular_price
function discount(regular_price, discount) {
    let dis = 20 || discount
    return Number(regular_price) * dis / 100
}

exports.shopkeeperUser = catchAsyncError(async (req, res, next) => {
    const otp = generateOTP(4);
    let refer = referralCodeGenerator.alpha('lowercase', 6)
    let { name, email, phone, password, regular_price, shop_name, shop_ads, category, refer_code, selling_price } = req.body
    
    if (!name || !email || !phone || !password || !shop_name || !shop_ads || !category || !regular_price || !selling_price) {
        return next(new ErrorHandler("Field Cannot be Blank", 400))
    }
    // const loginExist = await LoginModel.findOne({ phone })
    const loginExist = await LoginModel.findOne({ email })
    const numberExist = await otpModel.findOne({ phone })
    const account = await AccountModel.findOne({ phone })
    await phoneOtpSend(otp,phone)

    if (loginExist) {
        return next(new ErrorHandler("This Email already registered", 400))
    }

    if (refer_code) {
        const referExist = await LoginModel.findOne({ refer_code: refer_code })
        if (!referExist) {
            return next(new ErrorHandler("refer_code not exist", 400))
        }

        if (referExist) {
            if (account) {
                if (account.isVerified) {
                    return next(new ErrorHandler("This number is already verified", 400))
                }
                if (!account.isVerified) {
                    await otpModel.findByIdAndDelete(numberExist)
                    await AccountModel.findByIdAndDelete(account)
                    const encryptOtp = await bcrypt.hash(otp, 10)

                    const otpSend = await phoneOtpSend(otp, phone)
                    console.log(otpSend)

                    await otpModel.create({
                        phone,
                        otp: encryptOtp
                    })

                    // await AccountModel.create(req.body)
                    await AccountModel.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, password, shop_name, shop_ads, category, refer_code: refer,  reference_id: referExist.userId, refer_Exist: refer_code })

                    return res.json({
                        success: true,
                        message: "otp sent to your number",
                        otp
                    }).status(200)
                }
            }
            if (!account) {
                await otpModel.findByIdAndDelete(numberExist)
                const encryptOtp = await bcrypt.hash(otp, 10)
                await otpModel.create({
                    phone,
                    otp: encryptOtp
                })

                // await AccountModel.create(req.body)
                await AccountModel.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, password, shop_name, shop_ads, category, refer_code: refer, reference_id: referExist.userId,refer_Exist: refer_code  })
                return res.json({
                    success: true,
                    message: "otp sent to your number",
                    otp,
                    refer_code: refer
                }).status(200)
            }
        }
    } else {
        if (account) {
            if (account.isVerified) {
                return next(new ErrorHandler("This number is already verified", 400))
            }
            if (!account.isVerified) {
                await otpModel.findByIdAndDelete(numberExist)
                await AccountModel.findByIdAndDelete(account)
                const encryptOtp = await bcrypt.hash(otp, 10)

                await otpModel.create({
                    phone,
                    otp: encryptOtp
                })
                // await AccountModel.create(req.body)
                await AccountModel.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, password, shop_name, shop_ads, category, refer_code: refer })

                return res.json({
                    success: true,
                    message: "otp sent to your number",
                    otp
                }).status(200)
            }
        }
        if (!account) {
            await otpModel.findByIdAndDelete(numberExist)
            const encryptOtp = await bcrypt.hash(otp, 10)
            await otpModel.create({
                phone,
                otp: encryptOtp
            })

            // await AccountModel.create(req.body)
            await AccountModel.create({ name, email, phone, selling_price: selling_price, regular_price: regular_price, password, shop_name, shop_ads, category, refer_code: refer })
            return res.json({
                success: true,
                message: "otp sent to your number",
                otp,
                refer_code: refer
            }).status(200)
        }
    }

})

exports.shopOtpVerify = catchAsyncError(async (req, res, next) => {

    const { phone, otp } = req.body
    if (!phone || !otp) {
        return next(new ErrorHandler("field cannot be blank", 400))

    }

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
        // Shopkeeper db save
        let user = await ShopKeeper.create({ name: isVerified.name, email: isVerified.email, password: pass, contact: isVerified.phone, shop_name: isVerified.shop_name, shop_ads: isVerified.shop_ads, category: isVerified.category, screenshot: isVerified.screenshot, regular_price: isVerified.regular_price, refer_code: isVerified.refer_code, reference_id: isVerified.reference_id, selling_price: isVerified.selling_price, userId: isVerified._id })

        let createdAccount = await LoginModel.create({ name: isVerified.name, email: isVerified.email, password: pass, contact: isVerified.phone, shop_name: isVerified.shop_name, regular_price: isVerified.regular_price, shop_ads: isVerified.shop_ads, category: isVerified.category, type: isVerified.type, screenshot: isVerified.screenshot, refer_code: isVerified.refer_code, userId: user.userId, reference_id: isVerified.reference_id, selling_price: isVerified.selling_price })

        if (user.reference_id) {
            await ReferCodes.create({ userId: user.userId, refer_code: isVerified.refer_Exist, referred_id: user.reference_id })
        }
        await AccountModel.deleteOne(isVerified)
    }

    res.json({
        success: true,
        message: "Successfully Verified",
        id: isMatch._id,
    }).status(200)


})

