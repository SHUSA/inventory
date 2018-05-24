const fs = require('fs')
const Mongoose = require('mongoose')
const config = require('../config/config')
const out = {}

module.exports = () => {
  const db = Mongoose.connect(config.db, { keepAlive: 500 })
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

  out.db = db

  return out
}
