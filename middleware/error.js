module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    if (err.code === 11000) {
        err.message = "Duplicate Key Error"
        err.statusCode = 400
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message
    })
}