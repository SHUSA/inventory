'use strict'
module.exports = {
  NODE_ENV: '"production"',
  PORT: JSON.stringify(process.env.PORT),
  SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
  HOST: JSON.stringify(process.env.HOST),
  devtools: false,
  debug: false,
  silent: true
}
