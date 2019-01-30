const { Department } = require('../models')
const { User } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'passwordHint', {
      type: Sequelize.STRING
    })

    queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN
    })

    queryInterface.addColumn('Users', 'itemDefaults', {
      type: Sequelize.JSONB
    })

    queryInterface.addColumn('Users', 'assayDefaults', {
      type: Sequelize.JSONB
    })

    queryInterface.removeColumn('Users', 'initials')
    queryInterface.removeColumn('Users', 'accessLevel')

    let department = (await Department.findOne({where: {
      name: 'All'
    }})).dataValues

    await User.create({
      username: 'Administrator',
      isAdmin: true,
      DepartmentId: department.id
    })

    department = (await Department.findOne({where: {
      name: 'Molecular'
    }})).dataValues

    await User.create({
      username: 'MolecularAdmin',
      isAdmin: true,
      DepartmentId: department.id
    })
  },

  down: async function (queryInterface, Sequelize) {
    await User.destroy({
      where: {}
    })
    queryInterface.removeColumn('Users', 'passwordHint')
    queryInterface.removeColumn('Users', 'isAdmin')
    queryInterface.removeColumn('Users', 'itemDefaults')
    queryInterface.removeColumn('Users', 'assayDefaults')

    queryInterface.addColumn('Users', 'initials', {
      type: Sequelize.STRING
    })
    queryInterface.addColumn('Users', 'accessLevel', {
      type: Sequelize.INTEGER
    })
  }
}
