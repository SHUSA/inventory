const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8
  // password will never match due to bcrypt
  // if (!user.changed('password')) {
  //   return
  // }
  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      // fixes setDataValue is not a function on update
      user.password = hash
      // user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      required: true
    },
    passwordHint: {
      type: DataTypes.STRING,
      defaultValue: 'No hints!'
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    itemDefaults: {
      type: DataTypes.JSONB,
      defaultValue: {
        weeksOfSafetyStock: 4,
        leadTimeDays: 7,
        weeksOfReorder: 4
      }
    },
    assayDefaults: {
      type: DataTypes.JSONB,
      defaultValue: {
        weeklyVolume: 0,
        weeklyRuns: 0,
        controlsPerRun: 0
      }
    }
  }, {
    hooks: {
      beforeCreate: function (user, department) {
        // default username
        if (!user.username || user.username.length === 0) {
          // to do: review default scheme
          user.username = `${department.name}User`
        }
        // default email
        if (!user.email || user.email.length === 0) {
          user.email = `${user.username.replace(/ /g, '').toLowerCase()}@bar.com`
        } else {
          user.email = user.email.toLowerCase()
        }
        // default password for regular users
        if (!user.password || user.password.length === 0) {
          user.password = `${user.username.replace(/ /g, '').toLowerCase()}12345`
        }
        // set DepartmentId
        user.DepartmentId = department.id
        return user
      },
      beforeUpdate: hashPassword,
      beforeSave: hashPassword,
      beforeBulkUpdate: function (user) {
        return hashPassword(user.attributes)
      }
    }
  })

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }

  User.associate = function (models) {
    User.belongsTo(models.Department)
    User.belongsTo(models.Role)
  }

  return User
}
