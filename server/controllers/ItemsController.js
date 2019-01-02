const { Item } = require('../models')

function calculateStockLevels (item, assay) {
  let weeklyUse = 0
  let baseStock = 0
  let leadTimeUsage = 0
  // stock calculation will only run if weekly volume AND reactions per item > 0
  // otherwise, reorder points will be user defined
  if (parseInt(assay.weeklyVolume) !== 0 && parseFloat(item.reactionsPerItem) !== 0) {
    // console.log(`weeklyVolume ${assay.weeklyVolume}`)
    // console.log(`weekly runs ${assay.weeklyRuns}`)
    // console.log(`controlsPerRun ${assay.controlsPerRun}`)
    // console.log(`reactionsPerItem ${item.reactionsPerItem}`)
    // to do: reevaluate sampleReplicates in formula
    // weeklyUse = (assay.weeklyVolume * assay.sampleReplicates +
    //   assay.weeklyRuns * assay.controlsPerRun) / item.reactionsPerItem
    weeklyUse = (parseInt(assay.weeklyVolume) + parseInt(assay.weeklyRuns) * parseInt(assay.controlsPerRun)) / parseInt(item.reactionsPerItem)
    // console.log('weeklyUse = (assay.weeklyVolume + assay.weeklyRuns * assay.controlsPerRun) / item.reactionsPerItem')
    // console.log(`assay.weeklyRuns * assay.controlsPerRun ${assay.weeklyRuns * assay.controlsPerRun}`)
    // console.log(`(assay.weeklyVolume + assay.weeklyRuns * assay.controlsPerRun) ${(assay.weeklyVolume + assay.weeklyRuns * assay.controlsPerRun)}`)
    // console.log(`weeklyUse ${weeklyUse}`)
    baseStock = weeklyUse * 4
    // console.log(`baseStock ${baseStock}`)
    item.safetyStock = Math.ceil(weeklyUse * parseFloat(item.weeksOfSafetyStock) * 100) / 100
    // console.log(`safetyStock ${item.safetyStock}`)
    leadTimeUsage = weeklyUse * parseFloat(item.leadTimeDays) / 7
    // console.log(`leadTimeUsage ${leadTimeUsage}`)
    item.reorderPoint = Math.ceil((leadTimeUsage + item.safetyStock + baseStock) * 100) / 100
    item.reorderQuantity = Math.ceil(weeklyUse * parseFloat(item.weeksOfReorder))
  }
  return item
}

module.exports = {
  async index (req, res) {
    try {
      const active = req.query.active
      const attributes = req.query.attributes
      let items = await Item.findAll({
        where: {
          active: active
        },
        order: [
          ['name', 'ASC']
        ],
        attributes: attributes
      })

      res.send(items)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    try {
      let items = await Item.findAll({
        where: {
          $or: ['id', 'AssayId', 'VendorId'].map(key => ({
            [key]: req.query.ids
          })),
          active: req.query.active
        },
        order: [
          ['name', 'ASC']
        ]
      })
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

    try {
      item = await Item.create(item)
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
          }
        })
      } else {
        for (let i = 0; i < list.length; i++) {
          await Item.update(list[i], {
            where: {
              id: list[i].id
            }
          })
        }
      }
      res.send(item || list)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async deactivate (req, res) {
    const id = req.body.params.id
    let results = null

    try {
      results = await Item.update({active: false}, {
        where: {
          $or: [
            {AssayId: id},
            {VendorId: id}
          ]
        }
      })
      res.send(results)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  }
}
