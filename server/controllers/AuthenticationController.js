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

function assignAccess (role) {
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

function compareAccess (targetUser, tokenUser, res) {
  const targetAccess = assignAccess(targetUser.Role)
  const tokenAccess = assignAccess(tokenUser.Role)

  return tokenAccess <= targetAccess || targetUser.username === `${targetUser.Department.name}User`
}

function denyAccess (res) {
  res.status(403).send({
    error: 'Update denied. Target user has equal priviledges or is a general user.'
  })
}

module.exports = {
  async getUsers (req, res) {
    const user = req.user
    let users = []
    try {
      // get users
      if (user.Role.isAdmin) {
        // if admin, get all users from that department
        users = await User.findAll({
          where: {
            DepartmentId: user.DepartmentId,
            [Op.not]: {
              [Op.or]: [
                { id: user.id },
                { username: `${user.Department.name}User` }
              ]
            }
          },
          include: [{
            model: Role,
            attributes: ['id', 'name']
          }, Department],
          attributes: {
            exclude: ['password', 'RoleId']
          },
          order: [
            [Department, 'name', 'ASC'],
            [Role, 'name', 'ASC']
          ]
        })
      } else if (user.Role.isSuperAdmin) {
        // if super admin, get all users,
        users = await User.findAll({
          where: {
            [Op.not]: {
              id: user.id
            }
          },
          include: [{
            model: Role,
            attributes: ['id', 'name']
          }, Department],
          attributes: {
            exclude: ['password', 'RoleId']
          },
          order: [
            [Department, 'name', 'ASC'],
            [Role, 'name', 'ASC']
          ]
        })
      }

      const access = assignAccess(user.Role)
      const excRole = [{ isSuperAdmin: true }]

      if (access < 3) {
        excRole.push({ isAdmin: true })
      }

      const roles = await Role.findAll({
        where: {
          [Op.not]: {
            [Op.or]: excRole
          }
        },
        attributes: ['id', 'name'],
        order: [
          ['name', 'ASC']
        ]
      })

      res.send({ users, roles })
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async register (req, res) {
    const user = req.body.registration
    let department = null
    let role = null
    // check if department exists
    department = await Department.findOne({
      where: {
        name: user.department
      }
    })
    // get general user role
    role = (await Role.findOne({
      where: {
        isSubAdmin: false,
        isAdmin: false,
        isSuperAdmin: false
      }
    })).toJSON()

    if (!department) {
      // new department, make department if it does not exist
      department = (await Department.create({
        name: user.department
      })).toJSON()
      // create general user
      await User.create({
        RoleId: role.id
      }, department)
      // get admin role
      role = (await Role.findOne({
        where: {
          isSubAdmin: false,
          isAdmin: true,
          isSuperAdmin: false
        }
      })).toJSON()
    } else {
      department = department.toJSON()
    }

    user.DepartmentId = department.id
    user.RoleId = role.id

    try {
      let userJson = (await User.create(user, department)).toJSON()
      userJson = (await User.findOne({
        where: {
          id: userJson.id
        },
        include: [Department, Role]
      })).toJSON()
      userJson.isAdmin = role.isAdmin || role.isSuperAdmin
      userJson.isSubAdmin = role.isSubAdmin
      delete userJson.password
      delete userJson.RoleId
      delete userJson.Role

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
    let targetUser = req.body
    let assignToken = true

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
          return res.status(404).send({
            error: 'User to be updated cannot be found.'
          })
        }
      } catch (error) {
        console.log(error)
        return res.status(500).send(error.errors)
      }
      if (compareAccess(targetUser, tokenUser, res)) {
        return denyAccess(res)
      }

    }
    if (targetChanges.role) {
      // if there is a role change in the update
      if (!tokenUser.Role.isSubAdmin) {
        try {
          // find all users from the same department as target
          const deptUsers = await User.findAll({
            where: {
              DepartmentId: targetChanges.Department.id
            },
            include: [Role]
          })

          // find new role, must be admin or lower
          // if token is admin, new role cannot be higher than subadmin
          let role = (await Role.findOne({
            where: {
              id: targetChanges.Role.id
            }
          })).toJSON()

          if (!role) {
            return res.status(404).send({
              error: 'Invalid role.'
            })
          }

          // must have at least 1 admin in department; send error if role change results in 0 admins
          let userIndex = null
          deptUsers.findIndex((user, index) => {
            if (user.dataValues.id === targetUser.id) {
              userIndex = index
            }
          })
          if (userIndex) {
            deptUsers.splice(userIndex, 1)
          }
          const adminRoles = deptUsers.filter(user => user.dataValues.Role.name === 'Admin')
          if (adminRoles.length < 1) {
            return res.status(500).send({
              error: 'Unable to process. Must have at least one admin to a department.'
            })
          }
          targetChanges.RoleId = role.id
        } catch (error) {
          console.log(error)
          return res.status(500).send(error.errors)
        }
      } else {
        // if token is subadmin, cannot change roles
        delete targetChanges.RoleId
      }
      assignToken = false
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

      result.isAdmin = result.Role.isAdmin || result.Role.isSuperAdmin
      result.isSubAdmin = result.Role.isSubAdmin
      delete result.Role

      if (assignToken) {
        res.send({
          user: result,
          token: jwtSignUser(result)
        })
      } else {
        res.send(result)
      }
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
      return res.status(500).send(error.errors)
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
      user.isGeneral = true

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
      userJson.isAdmin = role.isAdmin || role.isSuperAdmin
      userJson.isSubAdmin = role.isSubAdmin
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
  },

  async reset (req, res) {
    let targetUser = req.body
    const tokenUser = req.user

    // only super admin or admin can reset and only those with lower access
    if (compareAccess(targetUser, tokenUser, res)) {
      return denyAccess(res)
    }

    targetUser.password = `${targetUser.username.replace(/ /g, '').toLowerCase()}12345`
    targetUser.passwordHint = 'Default password'

    try {
      await User.update(targetUser, {
        where: {
          id: targetUser.id
        }
      })

      delete targetUser.password

      res.send(targetUser)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}
