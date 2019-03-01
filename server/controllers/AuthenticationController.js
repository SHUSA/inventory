const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User } = require('../models')
const { Role } = require('../models')
const { Department } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const EIGHT_HOURS = 60 * 60 * 8
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: EIGHT_HOURS
  })
}

function assignAccess (user) {
  const role = user.Role
  let authLevel = 0

  if (role.isSubAdmin) {
    authLevel = 1
  } else if (role.isAdmin) {
    authLevel = 2
  } else if (role.isSuperAdmin) {
    authLevel = 3
  }

  return authLevel
}

module.exports = {
  async register (req, res) {
    const user = req.body.credentials
    let department = null
    let role = null
    // check if department exists
    // if department is new, new user becomes an admin
    // else is a normal user
    // to do: check to see if department exists
    department = (await Department.findOne({
      where: {
        name: req.body.department.name
      }
    })).toJSON()

    if (!department) {
      // new department, make department
      department = (await Department.create({
        name: req.body.department.name
      })).toJSON()
      // get admin role
      role = (await Role.findOne({
        where: {
          isSubAdmin: false,
          isAdmin: true,
          isSuperAdmin: false
        }
      })).toJSON()
    } else {
      // existing department, new user is normal user
      role = (await Role.findOne({
        where: {
          isSubAdmin: false,
          isAdmin: false,
          isSuperAdmin: false
        }
      })).toJSON()
    }

    user.DepartmentId = department.id
    user.RoleId = role.id

    try {
      const userJson = (await User.create(user, department)).toJSON()
      delete userJson.password
      delete userJson.RoleId

      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async update (req, res) {
    const targetChanges = req.body
    const tokenUser = req.user
    let targetUser = null

    // check if tokenUser and targetUser are same
    // if yes, allow edits
    // if not, check if target user is a general user; do not allow changes
    // if not, check if token user access is equal or same to target; do not allow changes
    // if not, check if token user access is higher than target's; allow change except for above

    if (targetChanges.id !== tokenUser.id) {
      // verify user being updated and get info
      try {
        targetUser = (await User.findOne({
          where: {
            id: targetChanges.id
          },
          include: [Department, Role]
        })).toJSON()

        if (!targetUser) {
          res.status(404).send({
            error: 'User to be updated cannot be found.'
          })
        }
      } catch (error) {
        console.log(error)
        res.status(500).send(error.errors)
      }
      const targetAccess = assignAccess(targetUser.Role)
      const tokenAccess = assignAccess(tokenUser.Role)

      if (tokenAccess <= targetAccess || targetUser.username === `${targetUser.Department.name}User`) {
        // deny change if general user or token access <= target
        res.status(403).send({
          error: 'Update denied. Target user has equal priviledges or is a general user.'
        })
      }
    }

    // to do: decide how new role will be received from service
    if (targetChanges.role) {
      if (!tokenUser.Role.isSubAdmin) {
        const newRole = targetChanges.role
        // if there is a role change in the update
        try {
          // find new role, must be admin or lower
          // if token is admin, new role cannot be higher than subadmin
          let role = (await Role.findOne({
            where: {
              isSubAdmin: newRole.isSubAdmin || false,
              isAdmin: tokenUser.Role.isAdmin ? false : (newRole.isAdmin || false),
              isSuperAdmin: false
            }
          })).toJSON()

          if (!role) {
            res.status(404).send({
              error: 'Invalid role.'
            })
          }
          targetChanges.RoleId = role.id
        } catch (error) {
          console.log(error)
          res.status(500).send(error.errors)
        }
      } else {
        // if token is subadmin, cannot change roles
        delete targetChanges.RoleId
      }
    }

    if (targetChanges.password === '' || targetChanges.password === null || targetChanges.password === undefined) {
      delete targetChanges.password
    }

    try {
      let result = await User.update(targetChanges, {
        where: {
          id: targetUser.id
        },
        returning: true,
        plain: true
      })
      result = (await User.findOne({
        where: {
          id: result[1].dataValues.id
        },
        attributes: {
          exclude: ['password', 'RoleId', 'password']
        },
        include: [Department, Role]
      })).toJSON()

      result.isAdmin = result.Role.isAdmin || result.Role.isSubAdmin || result.Role.isSuperAdmin
      delete result.Role

      res.send({
        user: result,
        token: jwtSignUser(result)
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  checkSession (req, res) {
    // dummy method to prevent 404 on token check
    res.send(true)
  },

  async userLogin (req, res) {
    // log in using department and verify role as user
    const department = req.body
    let role = null
    try {
      // try catch for user role
      role = (await Role.findOne({
        where: {
          isSubAdmin: false,
          isAdmin: false,
          isSuperAdmin: false
        }
      })).toJSON()
    } catch (error) {
      // if role does not exist, there's a problem
      console.log(error)
      res.status(500).send(error.errors)
    }

    try {
      let user = (await User.findOne({
        where: {
          DepartmentId: department.id,
          RoleId: role.id
        },
        include: [Department],
        attributes: {
          exclude: ['password', 'RoleId', 'passwordHint']
        }
      })).toJSON()

      if (!user) {
        return res.status(404).send({
          error: 'General user cannot be found'
        })
      }

      const token = jwtSignUser(user)
      user.isAdmin = false

      // give user token and send
      res.send({
        user: user,
        token: token
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  },

  async login (req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {email: username},
            {username: username}
          ]
        },
        include: [Department, Role]
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
      const token = jwtSignUser(userJson)

      const role = userJson.Role
      // roles come into play in other functions
      userJson.isAdmin = role.isAdmin || role.isSubAdmin || role.isSuperAdmin
      delete userJson.password
      delete userJson.RoleId
      delete userJson.Role

      res.send({
        user: userJson,
        token: token
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
