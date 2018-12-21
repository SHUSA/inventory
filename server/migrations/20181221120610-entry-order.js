const { Item } = require('../models')
const { Entry } = require('../models')

async function itemIndex() {
  // get ALL items
  let items = await Item.findAll()
  return items
}

async function entryIndex() {
  let entries = await Entry.findAll()
  return entries
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let itemArr = await itemIndex()
    let entryArr = await entryIndex()
    let found = null
    entryArr.forEach(entry => {
      found = itemArr.find(item => item.dataValues.id === entry.dataValues.ItemId)
      entry.dataValues.orderAmount = found.dataValues.reorderQuantity
    })
    for (let i = 0; i < entryArr.length; i++) {
      await Entry.update(
        { orderAmount: entryArr[i].dataValues.orderAmount },
        {
          where: {
            id: entryArr[i].dataValues.id
          }
        }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    let entryArr = await entryIndex()
    for (let i = 0; i < entryArr.length; i++) {
      await Entry.update(
        { orderAmount: entryArr[i]._previousDataValues.orderAmount },
        {
          where: {
            id: entryArr[i]._previousDataValues.id
          }
        }
      )
    }
  }
}
