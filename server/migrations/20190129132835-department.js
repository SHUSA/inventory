const { Order } = require('../models')
const { Assay } = require('../models')
const { Department } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Departments', 'location', {
      type: Sequelize.STRING
    })
    // queryInterface.removeColumn('Departments', 'location')
    // await Department.destroy({ where: {} })
    await Department.create({
      name: 'All',
      location: 'All'
    })
    let department = (await Department.create({
      name: 'Molecular',
      location: 'SRL'
    })).dataValues

    await Assay.update({DepartmentId: department.id}, {where: {}})
    await Order.update({DepartmentId: department.id}, {where: {}})

    department = (await Department.findOne({where: {
      name: 'Molecular'
    },
    include: [Assay, Order]
    })).dataValues
  },

  down: async function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Departments', 'location')

    await Department.destroy({where: {}})
    await Assay.update({DepartmentId: null}, {where: {}})
    await Order.update({DepartmentId: null}, {where: {}})
  }
}
