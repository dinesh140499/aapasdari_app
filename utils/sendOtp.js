const fast2sms = require('fast-two-sms')
const catchAsyncError = require('../utils/catchAsyncError')


module.exports = catchAsyncError(
    async (otp, number) => {
        try {
            const options = {
                authorization: process.env.fast2sms,
                message: `Otp : ${otp}`,
                numbers: [number]
            };

            const response = await fast2sms.sendMessage(options);

            return await response
        } catch (error) {
            console.log(error)
        }
    }
)



module.exports = catchAsyncError(async (req, res, next) => {

    const options = {
        authorization: process.env.fast2sms,
        message: `Otp`,
        numbers: ['7836008553']
    };

    const response = await fast2sms.sendMessage(options);

});

