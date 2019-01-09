const { Item } = require('../models')
const { Assay } = require('../models')
const { Vendor } = require('../models')
const { Entry } = require('../models')

async function itemIndex () {
  // get ALL items
  let items = await Item.findAll()
  return items
}

async function assayIndex () {
  let assays = await Assay.findAll()
  return assays
}

async function vendorIndex () {
  let vendors = await Vendor.findAll()
  return vendors
}

async function entryIndex () {
  let entries = await Entry.findAll()
  return entries
}

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Entries', 'itemName', {
      type: Sequelize.STRING
    })

    queryInterface.addColumn('Entries', 'assayName', {
      type: Sequelize.STRING
    })

    queryInterface.addColumn('Entries', 'vendorName', {
      type: Sequelize.STRING
    })

    queryInterface.addColumn('Entries', 'catalogNumber', {
      type: Sequelize.STRING
    })

    let itemArr = await itemIndex()
    let assayArr = await assayIndex()
    let vendorArr = await vendorIndex()
    let entryArr = await entryIndex()

    entryArr.forEach(entry => {
      let tempEntry = entry.dataValues
      itemArr.find(item => {
        let tempItem = item.dataValues
        if (tempItem.id === tempEntry.ItemId) {
          tempEntry.itemName = tempItem.name
          tempEntry.catalogNumber = tempItem.catalogNumber

          assayArr.find(assay => {
            let tempAssay = assay.dataValues
            if (tempItem.AssayId === tempAssay.id) {
              tempEntry.assayName = tempAssay.name
            }
          })

          vendorArr.find(vendor => {
            let tempVendor = vendor.dataValues
            if (tempItem.VendorId === tempVendor.id) {
              tempEntry.vendorName = tempVendor.name
            }
          })
        }
      })
    })

    for (let i = 0; i < entryArr.length; i++) {
      await Entry.update(entryArr[i].dataValues,
        {
          where: {
            id: entryArr[i].dataValues.id
          }
        })
    }
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Entries', 'itemName')

    queryInterface.removeColumn('Entries', 'assayName')

    queryInterface.removeColumn('Entries', 'vendorName')

    queryInterface.removeColumn('Entries', 'catalogNumber')
  }
}
