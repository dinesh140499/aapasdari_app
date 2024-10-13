const FCM = require('fcm-node');

exports.sendNotification = async (tokenUpdate, msg) => {
    try {
        const fcm = new FCM(process.env.server_key);
        const message = {
            to: tokenUpdate,
            data: {
                title: 'Aapasdari',
                image: "https://www.pushengage.com/wp-content/uploads/2023/06/In-App-Notification-Examples.png",
                body: 'You have received a new offer',
            },


            // data:{
            //     message:"hello"
            // }
        };

        const sendNotificationPromise = () => {
            return new Promise((resolve, reject) => {
                fcm.send(message, (err, response) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(response);
                    }
                });
            });
        };

        const response = await sendNotificationPromise();
        return response;
    } catch (err) {
        console.log(err);
        throw err; // Throw the error to be caught by the calling code if needed
    }
};



