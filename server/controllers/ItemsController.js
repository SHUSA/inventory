const { Item } = require('../models')

function calculateStockLevels (item, assay) {
  let weeklyUse = 0
  let baseStock = 0
  let leadTimeUsage = 0
  // stock calculation will only run if weekly volume AND reactions per item > 0
  // otherwise, reorder points will be user defined
  if (parseInt(assay.weeklyVolume) !== 0 && parseFloat(item.reactionsPerItem) !== 0) {
    // console.log(`weeklyVolume ${assay.weeklyVolume}`)
    // console.log(`replicates ${assay.sampleReplicates}`)
    // console.log(`weekly runs ${assay.weeklyRuns}`)
    // console.log(`controlsPerRun ${assay.controlsPerRun}`)
    weeklyUse = (assay.weeklyVolume * assay.sampleReplicates +
      assay.weeklyRuns * assay.controlsPerRun) / item.reactionsPerItem
    // console.log(`weeklyUse ${weeklyUse}`)
    baseStock = weeklyUse * 4
    // console.log(`baseStock ${baseStock}`)
    item.safetyStock = Math.ceil(weeklyUse * item.weeksOfSafetyStock * 100) / 100
    leadTimeUsage = weeklyUse * item.leadTimeDays / 7
    // console.log(`leadTimeUsage ${leadTimeUsage}`)
    item.reorderPoint = Math.ceil((leadTimeUsage + item.safetyStock + baseStock) * 100) / 100
    item.reorderQuantity = Math.ceil(weeklyUse * item.weeksOfReorder)
  }
  return item
}

module.exports = {
  async index (req, res) {
    let search = {}
    search.active = req.query.status
    try {
      let items = await Item.findAll({
        where: search,
        order: [
          ['name', 'DESC']
        ]
      })
      res.send(items)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  },

  async show (req, res) {
    try {
      let items = await Item.findAll({
        where: {
          id: req.query.itemIds
        },
        order: [
          ['VendorId', 'DESC']
        ]
      })
      res.send(items)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
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
      res.status(500).send(error.message)
    }
  },

  async put (req, res) {
    let item = req.body.params.item
    const assay = req.body.params.assay

    if (!item.order && !item.user && item.active) {
      item = calculateStockLevels(item, assay)
    }

    try {
      await Item.update(item, {
        where: {
          id: item.id
        }
      })
      res.send(item)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.message)
    }
  }
}
