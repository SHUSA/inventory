const passport = require('passport')
const { User } = require('./models')
const { Department } = require('./models')
const { Role } = require('./models')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('./config/config')

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authentication.jwtSecret
  }, async function (jwtPayLoad, done) {
    try {
      const user = (await User.findOne({
        where: {
          id: jwtPayLoad.id
        },
        include: [Department, Role]
      })).toJSON()
      // check if user department matches assay/order department?
      if (!user) {
        return done(new Error(), false)
      }
      return done(null, user)
    } catch (err) {
      return done(new Error(), false)
    }
  })
)

module.exports = null
