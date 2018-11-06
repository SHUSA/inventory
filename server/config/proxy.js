const db = require('./config').db

module.exports = {
  username: db.user,
  password: db.password,
  database: db.database,
  host: db.options.host,
  dialect: db.options.dialect
}
