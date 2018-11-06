module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Entries', 'orderAmount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Entries', 'orderAmount')
  }
}
