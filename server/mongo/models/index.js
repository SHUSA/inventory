const fs = require('fs')
const Mongoose = require('mongoose')
const out = {}

module.exports.connect = (uri) => {
  Mongoose.connect(uri, { keepAlive: 500 })
  // plug in the promise library:
  Mongoose.Promise = global.Promise

  Mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`)
    process.exit(1)
  })

  // load models
  fs.readdirSync(__dirname)
    .filter((file) =>
      file !== 'index.js'
    ).forEach((file) => {
      const model = file.split('.')[0]
      out[model] = require('../models/' + file)
    })

  return out
}
