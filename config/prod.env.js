'use strict'
module.exports = {
  NODE_ENV: '"production"',
  PORT: JSON.stringify(process.env.SRL_INVENTORY_DB_PORT),
  HOST: JSON.stringify(process.env.SRL_INVENTORY_HOST),
  devtools: false,
  debug: false,
  silent: true
}
