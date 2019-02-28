const { Department } = require('../models')
const { User } = require('../models')
const { Role } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.bulkInsert('Roles', [{
      name: 'User'
    }, {
      name: 'Sub Admin',
      isSubAdmin: true
    }, {
      name: 'Admin',
      isAdmin: true
    }, {
      name: 'Super Admin',
      isSuperAdmin: true
    }])

    queryInterface.bulkInsert('Departments', [{
      name: 'All',
      all: true,
      location: 'All'
    }])

    const department = (await Department.findOne({ where: { all: true } })).toJSON()
    const role = (await Role.findOne({ where: { isSuperAdmin: true } })).toJSON()

    await User.create({
      name: 'Administrator',
      RoleId: role.id
    }, department)
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Roles', null, {})
    queryInterface.bulkDelete('Departments', null, {})
  }
}
