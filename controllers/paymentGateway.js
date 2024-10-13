
const request = require('request');

const merchantId = 'YOUR_MERCHANT_ID';
const accessCode = 'YOUR_ACCESS_CODE';
const redirectUrl = 'YOUR_REDIRECT_URL';
exports.paymentGateway = async (req, res,next) => {
    try {
        // Get payment details from the request body
        const { amount, orderId, currency, redirectUrl } = req.body;

        // Build the CCAvenue request parameters
        const params = {
            'merchant_id': 'YOUR_MERCHANT_ID',
            'order_id': 'UNIQUE_ORDER_ID', // Generate a unique order ID for each transaction
            'amount': '100.00', // Amount in INR (Indian Rupees)
            'currency': 'INR',
            'redirect_url': 'http://your-website.com/payment-response', // URL to which CCAvenue will redirect after payment
            'cancel_url': 'http://your-website.com/payment-cancel', // URL to which CCAvenue will redirect if the user cancels the payment
            'language': 'EN', // Language code (EN for English)
            'billing_name': 'John Doe', // Customer's name
            'billing_address': '123 Main St', // Customer's address
            'billing_city': 'City',
            'billing_state': 'State',
            'billing_zip': '123456', // ZIP code
            'billing_country': 'India', // Country
            'billing_tel': '1234567890', // Customer's telephone number
            'billing_email': 'john.doe@example.com', // Customer's email address
            // Add additional parameters as needed
        };

        // Make a POST request to CCAvenue
        request.post({ url: 'https://secure.ccavenue.com/transaction/initTrans', form: params }, (error, response, body) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            } else {
                // Redirect the user to CCAvenue payment page
                res.redirect(`https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${body}&access_code=${accessCode}&merchant_id=${merchantId}&redirect_url=${redirectUrl}`);
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });

    }

}
