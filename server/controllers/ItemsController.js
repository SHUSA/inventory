const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { Item } = require('../models')
const { Assay } = require('../models')
const { Vendor } = require('../models')

function calculateStockLevels (item, assay) {
  let weeklyUse = 0
  let baseStock = 0
  let leadTimeUsage = 0
  // stock calculation will only run if weekly volume AND reactions per item > 0
  // otherwise, reorder points will be user defined
  if (parseInt(assay.weeklyVolume) !== 0 && parseFloat(item.reactionsPerItem) !== 0) {
    // to do: reevaluate sampleReplicates in formula
    // weeklyUse = (assay.weeklyVolume * assay.sampleReplicates +
    //   assay.weeklyRuns * assay.controlsPerRun) / item.reactionsPerItem
    weeklyUse = (parseInt(assay.weeklyVolume) + parseInt(assay.weeklyRuns) * parseInt(assay.controlsPerRun)) / parseInt(item.reactionsPerItem)
    baseStock = weeklyUse * item.baseWeeks // default 4
    item.safetyStock = Math.ceil(weeklyUse * parseFloat(item.weeksOfSafetyStock) * 100) / 100
    leadTimeUsage = weeklyUse * parseFloat(item.leadTimeDays) / 7
    item.reorderPoint = Math.ceil((leadTimeUsage + item.safetyStock + baseStock) * 100) / 100
    item.reorderQuantity = Math.ceil(weeklyUse * parseFloat(item.weeksOfReorder))
  }
  return item
}

module.exports = {
  async index (req, res) {
    try {
      const attributes = req.query.attributes
      const search = {
        active: req.query.active
      }
      if (!req.user.Department.all) {
        search.DepartmentId = req.user.DepartmentId
      }
      let items = await Item.findAll({
        where: search,
        order: [
          ['name', 'ASC']
        ],
        attributes: attributes,
        include: [Assay, Vendor]
      })

      res.send(items)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    console.log('show items')
    try {
      let items = await Item.findAll({
        where: {
          [Op.or]: ['id', 'AssayId', 'VendorId'].map(key => ({
            [key]: req.query.ids
          })),
          active: req.query.active
        },
        order: [
          ['name', 'ASC']
        ],
        include: [Assay, Vendor]
      })
      console.log(items)
      res.send(items)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    let item = req.body.params.item
    const assay = req.body.params.assay
    item = calculateStockLevels(item, assay)
    item.DepartmentId = req.user.DepartmentId

    try {
      item = await Item.create(item)
      item = await Item.findOne({
        where: {
          id: item.id
        },
        include: [Assay, Vendor]
      })
      res.send(item)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    const list = req.body.params.list
    let item = req.body.params.item
    const assay = req.body.params.assay
    const singleItem = list.length === 0
    const itemId = req.params.itemId
    let result = []
    // to do: clean up code to be more flexible

    // calculate reorder point as long as item is active
    // removed active condition, all items are active if passed through here
    // old condition: if (!item.order && !item.user && item.active)
    if (singleItem && assay) {
      item = calculateStockLevels(item, assay)
    } else {
      list.map(item => {
        if (item.assay) {
          item = calculateStockLevels(item, item.assay)
        }
      })
    }

    try {
      if (singleItem) {
        await Item.update(item, {
          where: {
            id: itemId
          },
          returning: true,
          plain: true
        }).then(async res => {
          result.push(
            await Item.findOne({
              where: {
                id: res[1].id
              },
              include: [Assay, Vendor]
            })
          )
        })
      } else {
        for (let i = 0; i < list.length; i++) {
          await Item.update(list[i], {
            where: {
              id: list[i].id
            },
            returning: true,
            plain: true
          }).then(async res => {
            result.push(
              await Item.findOne({
                where: {
                  id: res[1].id
                },
                include: [Assay, Vendor]
              })
            )
          })
        }
      }
      res.send(result)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async deactivate (req, res) {
    const id = req.body.params.id
    const active = req.body.params.active
    let results = null

    try {
      results = await Item.update({active: active}, {
        where: {
          $or: [
            {AssayId: id},
            {VendorId: id}
          ],
          active: true
        }
      })
      res.send(results)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async reassign (req, res) {
    const oldId = req.body.params.oldId
    const newId = req.body.params.newId
    const key = req.body.params.type
    let results = null

    try {
      results = await Item.update({[key]: newId}, {
        where: {
          [key]: oldId
        }
      })

      res.send(results)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  }
}
