'use strict'
console.log('production started')
console.log(JSON.stringify(process.env.PORT))
console.log(JSON.stringify(process.env.SERVER_PORT))
console.log(JSON.stringify(process.env.HOST))
const settings = {
  NODE_ENV: '"production"',
  PORT: JSON.stringify(process.env.PORT),
  SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
  HOST: JSON.stringify(process.env.HOST),
  devtools: false,
  debug: false,
  silent: true
}

module.exports = settings