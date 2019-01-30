const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const THIRTY_MINUTES = 60 * 30
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: THIRTY_MINUTES
  })
}

module.exports = {
  async register (req, res) {
    let user = req.body
    if (!user.email || user.email.length === 0 || user.email === undefined) {
      user.email = `${user.username.replace(/ /g, '').toLowerCase()}@bar.com`
    }
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

  async login (req, res) {
    const {name, password} = req.body
    // name field for general login
    try {
      await User.find({
        $or: [
          {email: name},
          {usename: name}
        ]}, (err, user) => {
        if (err) {
          console.log(err)
        } else {
          const isPasswordValid = user.comparePassword(password)

          if (!user || !isPasswordValid) {
            return res.status(403).send({
              error: 'Login information is incorrect'
            })
          }

          const userJson = user.toJSON()
          res.send({
            user: userJson,
            token: jwtSignUser(userJson)
          })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
