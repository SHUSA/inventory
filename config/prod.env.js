'use strict'
const env = require('../ecosystem.config').devSettings
console.log('production started')
const settings = {
  NODE_ENV: '"production"',
  PORT: JSON.stringify(process.env.PORT) || env.PORT,
  SERVER_PORT: JSON.stringify(process.env.SERVER_PORT) || env.SERVER_PORT,
  HOST: JSON.stringify(process.env.HOST) || env.HOST,
  devtools: false,
  debug: false,
  silent: true
}
console.log(settings)
module.exports = settings