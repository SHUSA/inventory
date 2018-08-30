'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: JSON.stringify(process.env.PORT),
  HOST: JSON.stringify(process.env.HOST)
})