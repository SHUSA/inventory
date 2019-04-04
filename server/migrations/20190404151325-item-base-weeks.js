const { User } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Items', 'baseWeeks', {
      type: Sequelize.REAL,
      defaultValue: 4
    })

    await User.update({
      itemDefaults: {
        baseWeeks: 4,
        weeksOfSafetyStock: 4,
        leadTimeDays: 7,
        weeksOfReorder: 4
      }
    },
    { where: {} })
  },

  down: async function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Items', 'baseWeeks')

    await User.update({
      itemDefaults: {
        weeksOfSafetyStock: 4,
        leadTimeDays: 7,
        weeksOfReorder: 4
      }
    },
    { where: {} })
  }
}
