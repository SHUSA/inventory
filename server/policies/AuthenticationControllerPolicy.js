const Joi = require('joi')

module.exports = {
  register (req, res, next) {
    const schema = {
      username: Joi.string().required().regex(
        new RegExp('^[a-zA-Z0-9]{3,}$')
      ),
      email: Joi.string().required().email(),
      password: Joi.string().required().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    }

    const { error } = Joi.validate(req.body.registration, schema, {
      abortEarly: false,
      allowUnknown: true
    })
    const errObj = {}
    if (error) {
      error.details.forEach(error => {
        switch (error.context.key) {
          case 'username':
            errObj.usernameError = 'Username must be at least 3 characters and only alphanumberic values'
            break
          case 'password':
            errObj.passwordError = 'Password must be 8-32 characters and only alphanumberic values'
            break
          case 'email':
            errObj.emailError = 'Invalid email format'
            break
          default:
            errObj.error = 'Invalid registration information'
        }
      })
      res.status(400).send(errObj)
    } else {
      next()
    }
  }
}
