const { Department } = require('../models')
const { User } = require('../models')
const { Role } = require('../models')

async function roleExists (obj) {
  let role = await Role.findOne({where: {name: obj.name}})

  if (!role) {
    await Role.create(obj)
  }
}

module.exports = {
  up: async function (queryInterface, Sequelize) {
    roleExists({ name: 'User' })
    roleExists({ name: 'Sub Admin', isSubAdmin: true })
    roleExists({ name: 'Admin', isAdmin: true })
    roleExists({ name: 'Super Admin', isSuperAdmin: true })

    const allDept = {
      name: 'All',
      all: true,
      location: 'All'
    }
    let dept = await Department.findOne({where: {name: allDept.name}})
    if (!dept) {
      await Department.create(allDept)
    }

    const department = (await Department.findOne({ where: { all: true } })).toJSON()
    const role = (await Role.findOne({ where: { isSuperAdmin: true } })).toJSON()

    const admin = {
      username: 'Administrator',
      RoleId: role.id
    }
    let user = await User.findOne({where: {username: admin.username}})
    if (!user) {
      await User.create(admin, department)
    }
  },

  down: async function (queryInterface, Sequelize) {
    await User.destroy({ where: { username: 'Administrator' } })
    await Role.destroy({ where: {} })
    await Department.destroy({ where: { name: 'All' } })
  }
}
