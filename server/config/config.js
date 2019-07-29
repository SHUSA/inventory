// const fs = require('fs')
const path = '../../../.inventory/db'
let db = {}

console.log(fs.existsSync(path))
// try {
//   if (fs.existsSync(path)) {
    db = require(path)
//   }
// } catch (error) {
//   console.log('Path does not exist. Using default config.')
// }

module.exports = {
  port: process.env.SERVER_PORT || 8081,
  host: process.env.HOST || 'localhost',

  db: {
    database: db.db_name || 'srl_inventory',
    user: db.db_user || 'postgres',
    password: db.db_password || 'root',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.SRL_INVENTORY_HOST || 'localhost',
      port: process.env.SRL_INVENTORY_DB_PORT || '5432',
      operatorsAliases: false
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
