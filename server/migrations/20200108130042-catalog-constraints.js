'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // original catalog key name constraint
    queryInterface.removeConstraint('Items', 'Items_catalogNumber_key')
    queryInterface.addConstraint('Items', ['longCatalog'],
      {
        type: 'unique',
        name: 'Items_longCatalog_key'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Items', ['catalogNumber'], {
      type: 'unique',
      name: 'Items_catalogNumber_key'
    })
    queryInterface.removeConstraint('Items', 'Items_longCatalog_key')
  }
}
