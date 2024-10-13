module.exports = (passedFun) => (req, res, next) => {
    Promise.resolve(passedFun(req, res, next)).catch(next)
}