const User = require('mongoose').model('User')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    const user = req.body
    const userData = {
      email: user.email,
      password: user.password,
      initials: user.initials,
      username: user.username
    }
    const newUser = new User(userData)
    const userJson = newUser.toJSON()
    try {
      await newUser.save((err) => {
        if (err) {
          console.log(err)
          res.send(err)
        } else {
          res.send({
            user: userJson,
            token: jwtSignUser(userJson)
          })
        }
      })
    } catch (error) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },

  async update (req, res) {
    const user = req.body
    const userData = {
      email: user.email,
      password: user.password,
      initials: user.initials,
      username: user.username,
      accessLevel: user.accessLevel
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
