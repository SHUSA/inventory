'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
console.log('development started')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: JSON.stringify(process.env.PORT),
  SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
  HOST: JSON.stringify(process.env.HOST),
})