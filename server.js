const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
// const { sequelize } = require('./server/sequelize/models')
// const config = require('./server/sequelize/config/config')
const config = require('./server/mongo/config/config')
require('./server/mongo/models')

// create the express app
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// adjust jwtstrategy for mongoose in passport
// require('./server/passport')
require('./server/routes')(app)

// create middleware to handle the serving the app
app.use("/", serveStatic(path.join(__dirname, '/dist')))

// Catch all routes and redirect to the index file
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html')
})

// sequelize.sync({ force: false }).then(() => {
//   app.listen(config.port)
//   console.log(`Server started on port ${config.port}`)
// })

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`)
})