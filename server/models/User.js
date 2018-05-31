const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {type: String, unique: true},
  password: {type: String},
  initials: {type: String},
  username: {type: String, unique: true, required: true},
  accessLevel: {type: Number, default: 1}
})

UserSchema.methods.comparePassword = function comparePassword (password, callback) {
  bcrypt.compare(password, this.password, callback)
}

UserSchema.pre('save', function saveHook (next) {
  const user = this
  const SALT_FACTOR = 8

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) {
    return
  }

  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.password = hash
    })
})

module.exports = mongoose.model('User', UserSchema)
