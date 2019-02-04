const { User } = require('../models')
const { Department } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_DAY = 60 * 60 * 24
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_DAY
  })
}

module.exports = {
  async register (req, res) {
    let user = req.body
    try {
      const userJson = (await User.create(user)).toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (error) {
      console.log(error)
      res.status(400).send(error.errors)
    }
  },

  async update (req, res) {
    let user = req.body
    if (user.password === '' || user.password === null || user.password === undefined) {
      delete user.password
    }
    try {
      let result = await User.update(user, {
        where: {
          id: user.id
        },
        returning: true,
        plain: true
      })
      result = (await User.findOne({
        where: {
          id: result[1].dataValues.id
        },
        include: [Department]
      })).toJSON()

      res.send({
        user: result,
        token: jwtSignUser(user)
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  // create route for password recovery

  async login (req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({
        where: {
          $or: [
            {email: username},
            {username: username}
          ]
        },
        include: [Department]
      })

      if (!user) {
        return res.status(403).send({
          error: 'Login information is incorrect'
        })
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'Login information is incorrect',
          hint: user.passwordHint
        })
      }

      const userJson = user.toJSON()

      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
