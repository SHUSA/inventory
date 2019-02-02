const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    // to do: if !user, deny access
    // returns user information if token is valid
    if (err) {
      res.status(403).send({
        error: 'Invalid access'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
