module.exports = {
  up: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.changeColumn('Items', 'weeksOfSafetyStock',
        {
          type: Sequelize.REAL,
          defaultValue: 0
        }),
      queryInterface.changeColumn('Items', 'leadTimeDays',
        {
          type: Sequelize.REAL,
          defaultValue: 0
        }),
      queryInterface.changeColumn('Items', 'weeksOfReorder',
        {
          type: Sequelize.REAL,
          defaultValue: 0
        })
    ])
  },

  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.changeColumn('Items', 'weeksOfSafetyStock',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }),
      queryInterface.changeColumn('Items', 'leadTimeDays',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }),
      queryInterface.changeColumn('Items', 'weeksOfReorder',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        })
    ])
  }
}
