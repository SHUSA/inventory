const Joi = require('joi')

module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ),
      username: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{3}$')
      )
    }

    const { error } = Joi.validate(req.body, schema)
    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'Username must be at least 5 characters and only alphanumberic values'
          })
          break
        case 'password':
          res.status(400).send({
            error: 'Password must be 8-32 characters and only alphanumberic values'
          })
          break
        case 'email':
          res.status(400).send({
            error: 'Invalid email format'
          })
          break
        default:
          res.status(400).send({
            error: 'Invalid registration information'
          })
      }
    } else {
      next()
    }
  }
}
