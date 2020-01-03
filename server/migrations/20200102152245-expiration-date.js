'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Items', 'expirationDate', {
      type: Sequelize.STRING
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Items', 'expirationDate')
  }
}
