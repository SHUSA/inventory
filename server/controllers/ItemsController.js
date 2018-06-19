const Item = require('mongoose').model('Item')
const Order = require('mongoose').model('Order')
const moment = require('moment')
// should probably search by assay or vendor then display items

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
    search[req.query.search] = JSON.parse(req.query.item).name
    try {
      await Item.find(search).sort({name: -1}).exec((err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching items'
      })
    }
  },

  async show (req, res) {
    try {
      await Item.find({_id: {$in: req.query.itemIds}}, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching item'
      })
    }
  },

  async post (req, res) {
    const item = req.body.params.item
    const assay = req.body.params.assay
    let itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData.assay = assay.name
    itemData = calculateStockLevels(itemData, assay)
    const newItem = new Item(itemData)

    try {
      await newItem.save((err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          res.send(newItem)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving item'
      })
    }
  },

  async put (req, res) {
    const item = req.body.params.item
    const assay = req.body.params.assay
    const lastSunday = moment().startOf('week').toISOString()
    let itemData = {}
    let entry = []
    for (let key in item) {
      itemData[key] = item[key]
    }
    if (!item.order && !item.user && item.active) {
      itemData.assay = assay.name
      itemData = calculateStockLevels(itemData, assay)
    }
    entry = [{
      item: itemData._id,
      updatedAt: itemData.updatedAt,
      currentStock: itemData.currentStock,
      comment: itemData.comment
    }]
    console.log('before try')
    console.log(itemData)
    try {
      // push new quantity in currentStock either here or before passing
      // add to order only it is an actual order and not data fix. add flag somewhere?
      await Item.update({ _id: itemData._id }, itemData, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else if (item.order) {
          Order.findOneAndUpdate(
            {createdAt: {$gte: lastSunday}},
            { $pull: { entry: { item: itemData._id } } }, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                console.log('pull done')
              }
            })
          Order.findOneAndUpdate(
            { createdAt: { $gte: lastSunday } },
            { $push: { entry: entry } },
            { new: true }, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                console.log('pushed')
                res.send(itemData)
              }
            })
        } else {
          console.log('normal update')
          res.send(itemData)
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'An error occured updating item'
      })
    }
  }
}
