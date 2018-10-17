const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./server/models')
const config = require('./server/config/config')
// create the express app
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// require('./server/passport')
require('./server/routes')(app)

// create middleware to handle the serving the app
// for use with heroku
app.use("/", serveStatic(path.join(__dirname, '/dist')))

// Catch all routes and redirect to the index file
// for use with heroku
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html')
})

let port = config.port
let host = config.host

if (process.env.NEWDB === 'true') {
  sequelize.sync({ force: true }).then(() => {
    app.listen(port, host)
    if (process.env.NEWDB) console.log('Tables have been formatted')
    console.log(`Server started on port ${port}`)
  })  
} else {
  app.listen(port, host, () => {
    console.log(`Server started on port ${port}`)
  })
}

