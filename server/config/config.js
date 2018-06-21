const config = require('./index.json')
console.log('server')
console.log(process.env)
module.exports = {
  port: process.env.PORT || 8081,
  db: process.env.MONGODB_URI || config.dbUri,
  jwtSecret: process.env.JWT_SECRET || 'secret'
}
