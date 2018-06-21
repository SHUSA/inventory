const config = require('./index.json')

module.exports = {
  port: process.env.PORT || 8081,
  db: process.env.MONGODB_URI || config.dbUri,
  jwtSecret: process.env.JWT_SECRET || 'secret'
}
