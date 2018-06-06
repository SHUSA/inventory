const Item = require('mongoose').model('Item')
const Order = require('mongoose').model('Order')
// should probably search by assay or vendor then display items

function calculateStockLevels (item, assay) {
  let weeklyUse = 0
  let baseStock = 0
  let leadTimeUsage = 0
  // consider if reactionsPerItem is 0 but is used in a volume dependent assay; avoid  divided by 0
  if (assay.weeklyVolume !== 0 || item.reactionsPerItem !== 0) {
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
  // console.log(item)
  return item
}

module.exports = {
  async index (req, res) {
    try {
      await Item.find({active: req.query.status}).sort({name: -1}).exec((err, doc) => {
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
      await Item.find({_id: req.params.itemId}, (err, doc) => {
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
    console.log(req.body.params)
    // console.log(assay)
    let itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData.assay = assay.name
    itemData = calculateStockLevels(itemData, assay)
    const newItem = new Item(itemData)

    try {
      console.log('try')
      await newItem.save((err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          Order.find().sort({_id: -1}).limit(1)
            .updateOne({ $addToSet: { items: doc._id } },
              { new: true }, (err, newdoc) => {
                if (err) {
                  console.log(err)
                  res.send(err.message)
                } else {
                  // specify assay, do a console.log on newdoc
                  res.send(newItem)
                }
              })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving item'
      })
    }
  },

  async put (req, res) {
    console.log(req.body)
    const item = req.body.params.item
    const assay = req.body.params.assay
    let itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData.assay = assay.name
    itemData = calculateStockLevels(itemData, assay)

    try {
      // push new quantity in currentStock either here or before passing
      await Item.update({ _id: itemData._id }, itemData, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          Order.find().sort({ _id: -1 }).limit(1)
            .updateOne({ $addToSet: { items: itemData._id } },
              { new: true }, (err, newdoc) => {
                if (err) {
                  console.log(err)
                  res.send(err.message)
                } else {
                  res.send(itemData)
                }
              })
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
