const { Item } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await Item.update({
      itemDescription: ''
    }, {
      where: {
        itemDescription: null
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
