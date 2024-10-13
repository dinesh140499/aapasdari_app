const fileUpload = require('express-fileupload')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config({ path: ".env" })
const bodyParser = require('body-parser')
const ErrorMiddleware = require('./middleware/error')

const app = express()
const allRoutes = require('./routes/allRoutes')
const cookieParser = require('cookie-parser')

// Routes
const admin = require('./routes/admin')
const event = require('./routes/event')
const createRoute = require('./routes/createRoute')
const payment = require('./routes/payment')
const allowedOrigins=["http://localhost:3000","http://194.163.34.72:3000","http://localhost:5173"]

// app.use()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))
app.use(cors({
    credentials: true, origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}))


app.use('/aapasdari/api', createRoute)
app.use('/aapasdari/api/user', allRoutes)
app.use('/aapasdari/api/payment', payment)
app.use('/aapasdari/admin', admin)
app.use('/aapasdari/event', event)
// app.use('/aapasdari/service', addService)
app.use(ErrorMiddleware)


module.exports = app