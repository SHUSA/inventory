module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
    queryInterface.addColumn('Entries', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'active')
    queryInterface.removeColumn('Entries', 'active')
  }
}
