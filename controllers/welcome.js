const fs = require('fs')
const LoginModel = require('../models/loginModel')
const Wishlist = require('../models/wishlist')
const notification = require('../utils/sendNotification')
const Notification = require('../models/pushNotification')
const ReferCode = require('../models/refer_codes')
const Event = require('../models/event')
const catchAsyncError = require('../utils/catchAsyncError')
let rawData = fs.readFileSync('static/welcome.json');
const { accData } = require("../static/welcome2");
const ErrorHandler = require('../utils/errorHandler')
rawData = JSON.parse(rawData)
const Activity = require('../models/VisitingTime')
const Service = require('../models/serviceModel')

// Login > Welcome
exports.welcome = catchAsyncError(async (req, res, next) => {
    const { type, userId, fcm_token } = req.body

    if (userId) {
        const user = await LoginModel.findOne({ userId: userId })
        let data;

        if (!user) {
            return next(new ErrorHandler("User is not exist", 400))
        }

        if (user.type !== type) {
            return next(new ErrorHandler("User is not exist", 400))
        }

        const filterUser = await Service.find({ type: type })
        data = filterUser.map((item) => {
            const { title, accType, image, type } = item
            return { title, accType, image, type }
        })

        data = filterUser.filter(cur => cur.accType != type)
        await user.updateOne({ fcm_token: fcm_token, userId: userId })

        res.json({
            success: true,
            data: data
        }).status(200)

    } else {
        const data = await Service.find()
        const titleMap = new Map();

        data.forEach(obj => {
            if (obj.title !== "Youtubers & Shopkeepers") {
                obj.type = "";
                obj.accType = "";
                obj.role = "";
                titleMap.set(obj.title, obj);
            }
        });

        // Convert the map values back to an array
        const uniqueArray = Array.from(titleMap.values());


        res.json({
            success: true,
            data: uniqueArray
        })
    }
})

// Welcome > Choose Service
exports.chooseService = catchAsyncError(async (req, res, next) => {
    const { accType, title, userId, type } = req.body;
    let data = await LoginModel.find()
    if (userId) {
        const service = await Service.findOne({ title: title, accType: accType })
        const user = await LoginModel.findOne({ userId: userId })
        if (!user) {
            return next(new ErrorHandler("Invalid User Id"))
        }

        if (!service) {
            return next(new ErrorHandler("You are providing wrong data"))
        }

        if (service.title == 'Shopkeepers' || service.title == 'Youtubers' || service.title == 'Youtubers & Shopkeepers') {
            service.title.toLowerCase()
            data = data.filter(item => item.type != type)
            res.json({
                success: true,
                data: data
            })

        } else if (service.title == 'Awards and Events') {
            console.log("I am hit")
            const events = await Event.find()
            if (events.length <= 0) {
                return res.json({
                    success: true,
                    data: "data is empty"
                })
            }

            return res.json({
                success: true,
                data: events
            })
        } else if (service.title == 'Website and App Development') {
            return res.json({
                success: true,
                data: service.title
            })
        }
        else if (service.title == 'E-Commerce') {
            return res.json({
                success: true,
                data: service.title
            })
        } else {
            return res.json({
                success: true,
                data: "Data not found"
            })
        }
    } else {
        const service = await Service.findOne({ title: title })
        if (service.title == 'Shopkeepers' || service.title == 'Youtubers' || service.title == 'Youtubers & Shopkeepers') {
            // service.title.toLowerCase()
            if (service.title == 'Shopkeepers') {
                const data = await LoginModel.find({ type: 'shopkeeper' })
                return res.json({
                    success: true,
                    data: data
                })
            }

            if(service.title == 'Youtubers'){
                const data = await LoginModel.find({ type: 'youtube' })
               return res.json({
                    success: true,
                    data: data
                })
            }


        } else if (service.title == 'Awards and Events') {
            const events = await Event.find()
            if (events.length <= 0) {
                return res.json({
                    success: true,
                    data: "data is empty"
                })
            }

            return res.json({
                success: true,
                data: events
            })
        } else if (service.title == 'Website and App Development') {
            return res.json({
                success: true,
                data: service.title
            })
        }
        else if (service.title == 'E-Commerce') {
            return res.json({
                success: true,
                data: service.title
            })
        } else {
            return res.json({
                success: true,
                data: "Data not found"
            })
        }
    }
})



// User Profile
exports.userProfile = catchAsyncError(async (req, res, next) => {

    const { userId } = req.body

    const userIdMatch = await LoginModel.findOne({ userId: userId })
    if (!userIdMatch) {
        return next(new ErrorHandler("User not found", 400))
    }
    res.json({
        success: true,
        data: userIdMatch
    }).status(200)



})

// Welcome > Choose Service > Select Type
exports.selectType = catchAsyncError(async (req, res, next) => {

    const { userId, type } = req.body;

    if (type === 'youtube') {
        const users = await LoginModel.find({ type: type, userId: userId });

        if (users.length === 0) {
            return next(new ErrorHandler("User not found", 400))
        }

        // Assuming there could be multiple users with the same userId and type
        return res.json({
            success: true,
            data: users,
        }).status(200);
    }
    if (type === 'shopkeeper') {
        const users = await LoginModel.find({ type: type, userId: userId });

        if (users.length === 0) {
            return next(new ErrorHandler("User not found", 400))
        }

        // Assuming there could be multiple users with the same userId and type
        return res.json({
            success: true,
            data: users,
        }).status(200);
    }

})

// Add To Wishlist
exports.addToWishlist = catchAsyncError(async (req, res, next) => {
    const { wishlist_action, userId, wishlist_id } = req.body
    if (wishlist_action === 'remove') {
        const wishlistExist = await Wishlist.findOneAndDelete({ wishlist_id: wishlist_id })
        if (!wishlistExist) {
            return next(new ErrorHandler("wishlist id not exist", 400))

        }

        await LoginModel.findOneAndUpdate({ userId: wishlist_id }, { wishlist_id: "", wishlist_action: false })
        return res.status(200).json({
            success: true,
            message: "wishlist deleted"
        })
    }

    if (wishlist_action === 'add') {
        const wishlistExist = await Wishlist.findOne({ wishlist_id: wishlist_id })
        if (wishlistExist && wishlistExist.userId === userId) {
            return res.status(200).json({
                success: true,
                message: "this user already added to this wishlist"
            })
        }

        // let userAdded = await LoginModel.findOne({ userId: wishlist_id })

        await Wishlist.create(req.body)
        let wish = await LoginModel.updateOne({ userId: wishlist_id }, { $set: { wishlist_action: true, wishlist_id: userId } })
        return res.status(200).json({
            success: true,
            message: "wishlist created"
        })
    }
})

// show all get wishlists to login user
exports.wishlists = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;
    const wishlists = await Wishlist.find({ userId: userId });

    const data = await LoginModel.find({ $and: [{ wishlist_id: userId }, { wishlist_action: true || 'add' }] });

    return res.status(200).json({
        success: true,
        data: data,
    });

})

// pushNotification Notification
exports.pushNotification = catchAsyncError(async (req, res, next) => {
    const { userId, profile_Id, offer } = req.body

    if (!userId || !profile_Id || !offer) {
        return next(new ErrorHandler("field cannot be blank", 400))
    }

    const loggedUser = await LoginModel.findOne({ userId: userId })

    if (!loggedUser) {
        return next(new ErrorHandler("user not exist", 400))
    }

    const profileUser = await LoginModel.findOne({ userId: profile_Id })
    if (!profileUser) {
        return next(new ErrorHandler("profile not exist", 400))
    }


    await Notification.create({ userId: userId, profile_Id: profile_Id, offer: offer, action: 'not-confirmed' })
    await notification.sendNotification(profileUser.fcm_token, {
        userId: userId,
        name: profileUser.name,
        type: profileUser.type,
        price: profileUser.selling_price,
        offer: offer
    })
    res.json({
        success: true,
        data: "Offer Sent"
    })

})

exports.showNotification = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;

    try {
        const userNotifications = await Notification.find({ userId: userId });
        const loginUser = await LoginModel.find();

        // Assuming 'profile_Id' is the correct property name in the 'user' object
        const filteredData = loginUser.filter(cur => userNotifications.some(notification => notification.profile_Id === cur.userId));

        const newData = filteredData.map(cur => {
            const matchingNotification = userNotifications.find(notification => notification.profile_Id === cur.userId);

            return {
                profile_Id: cur.userId,
                name: cur.name,
                offer: matchingNotification ? matchingNotification.offer : null,
                type: cur.type,
                time: cur.createAt,
                action: matchingNotification ? matchingNotification.action : null
            };
        });

        res.json({
            success: true,
            data: newData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

// pushNotification Notification > Notification Accept / Reject 
exports.pushNotificationAction = catchAsyncError(async (req, res, next) => {

    const { userId, profile_Id, action } = req.body

    if (!userId || !profile_Id) {
        return next(new ErrorHandler("field cannnot be blank", 400))
    }

    const loggedUser = await Notification.findOne({ userId: userId })
    await Notification.updateOne({ profile_Id: profile_Id }, {
        action: action ||
            'not-confirmed'
    })
    const user = await LoginModel.findOne({ userId: userId })

    if (!user) {
        return res.json({
            success: false,
            message: "user not exist"
        }).status(400)
    }

    const profileUser = await LoginModel.findOne({ userId: profile_Id })

    if (!profileUser) {
        return next(new ErrorHandler("profile not exist", 400))
    }

    let notify = await notification.sendNotification(user.fcm_token, {
        userId: userId,
        name: profileUser.name,
        type: profileUser.type,
        price: profileUser.selling_price,
        offer: profileUser.offer
    })

    res.json({
        success: true,
        data: `notification ${action ? action : ""}`
    })

})

// Visitor Timestamps
exports.userActivity = catchAsyncError(async (req, res, next) => {
    const { userId, timestamp, action } = req.body
    if (!userId || !timestamp) {
        return next(new ErrorHandler("field cannnot be blank", 400))
    }
    await Activity.create(req.body)
    res.json({
        success: true,
        message: "done"
    })
})