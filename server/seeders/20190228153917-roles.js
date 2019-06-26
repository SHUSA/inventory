const { Department } = require('../models')
const { User } = require('../models')
const { Role } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await Role.create({ name: 'User' })
    await Role.create({ name: 'Sub Admin', isSubAdmin: true })
    await Role.create({ name: 'Admin', isAdmin: true })
    await Role.create({ name: 'Super Admin', isSuperAdmin: true })
    await Department.create({
      name: 'All',
      all: true,
      location: 'All'
    })

    const department = (await Department.findOne({ where: { all: true } })).toJSON()
    const role = (await Role.findOne({ where: { isSuperAdmin: true } })).toJSON()

    await User.create({
      username: 'Administrator',
      RoleId: role.id
    }, department)
  },

  down: async function (queryInterface, Sequelize) {
    await User.destroy({ where: { username: 'Administrator' } })
    await Role.destroy({ where: {} })
    await Department.destroy({ where: { name: 'All' } })
  }
}
