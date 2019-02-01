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
    const user = req.body
    const userData = {}
    for (let key in user) {
      userData[key] = user[key]
    }

    try {
      // to do: refactor
      await User.update({_id: req.body.id}, userData, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err)
        } else {
          res.send({
            user: userData,
            token: jwtSignUser(userData)
          })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'Cannot update account'
      })
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
          error: 'Login information is incorrect'
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
