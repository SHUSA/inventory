const { Department } = require('../models')
const { Order } = require('../models')
const { Vendor } = require('../models')
const { Item } = require('../models')
const { Assay } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Vendors', 'DepartmentId')
    queryInterface.removeColumn('Vendors', 'vendorCatalog')
    queryInterface.addColumn('Vendors', 'DepartmentId', {
      type: Sequelize.STRING
    })
    queryInterface.addColumn('Vendors', 'vendorCatalog', {
      type: Sequelize.STRING
    })

    const dept = (await Department.findOne({
      where: {
        name: 'Molecular'
      }
    })).toJSON()
    const update = {
      DepartmentId: dept.id
    }

    await Order.update(update, { where: {} })
    await Item.update(update, { where: {} })
    await Assay.update(update, { where: {} })
    let vendors = await Vendor.findAll()
    for (let i = 0; i < vendors.length; i++) {
      let vend = vendors[i].toJSON()
      vend.DepartmentId = dept.id
      await Vendor.update(vend, {
        where: {
          id: vend.id
        }
      })
    }
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Vendors', 'DepartmentId')
    queryInterface.removeColumn('Vendors', 'vendorCatalog')
  }
}
