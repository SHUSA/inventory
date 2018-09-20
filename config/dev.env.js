'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: JSON.stringify(process.env.PORT),
  HOST: JSON.stringify(process.env.SRL_INVENTORY_HOST),
  TEST1: '"test1"'
})