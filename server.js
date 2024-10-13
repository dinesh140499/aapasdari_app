const app = require('./app')

let port=process.env.PORT || 3000


// Database connection
require('./utils/conn')


app.listen(port, () => {
    console.log(`server is running on port no : ${process.env.PORT}`)
})