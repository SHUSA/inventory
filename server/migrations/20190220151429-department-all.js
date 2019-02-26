const { Department } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Departments', 'all', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })

    await Department.update({all: true}, {
      where: {
        location: 'All'
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Departments', 'all')
  }
}
