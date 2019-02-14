const { Department } = require('../models')
const { Item } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    // add new column first
    queryInterface.addColumn('Items', 'longCatalog', {
      type: Sequelize.STRING
    })
    // associate with department
    queryInterface.addColumn('Items', 'DepartmentId', {
      type: Sequelize.UUID
    })
    // then call all items and add dept id
    let department = (await Department.findOne({where: {
      name: 'Molecular'
    }})).toJSON()
    let items = await Item.findAll({ where: {} })
    let itemArr = []
    items.forEach(item => {
      item.dataValues.DepartmentId = department.id
      itemArr.push(item.dataValues)
    })
    for (let i = 0; i < itemArr.length; i++) {
      await Item.update(itemArr[i], {
        where: {
          id: itemArr[i].id
        }
      })
    }
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Items', 'DepartmentId')
    queryInterface.removeColumn('Items', 'longCatalog')
  }
}
