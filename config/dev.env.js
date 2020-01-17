'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const env = require('../ecosystem.config').devSettings

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: JSON.stringify(process.env.PORT) || env.PORT,
  SERVER_PORT: JSON.stringify(process.env.SERVER_PORT) || env.SERVER_PORT,
  HOST: JSON.stringify(process.env.HOST) || env.HOST,
})