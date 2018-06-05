const Item = require('mongoose').model('Item')
const Order = require('mongoose').model('Order')
const Assay = require('mongoose').model('Assay')
// should probably search by assay or vendor then display items

function calculateStockLevels (item, res) {
  Assay.find({ name: item.assay }, (err, doc) => {
    let assay = {}
    let weeklyUse = 0
    let baseStock = 0
    let leadTimeUsage = 0
    console.log('ping')
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      assay = doc[0]
      console.log('pong')
      // double check logic; example BV plates
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
  })
}

module.exports = {
  async index (req, res) {
    try {
      await Item.find().sort({name: -1}).exec((err, doc) => {
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
    const item = req.body
    let itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData = await calculateStockLevels(itemData, res)
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
                  res.send(doc)
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
    const item = req.body
    let itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData = await calculateStockLevels(itemData, res)
    console.log('item data')
    console.log(itemData)
    try {
      // push new quantity in currentStock either here or before passing
      await Item.update({_id: itemData._id}, itemData, (err, doc) => {
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
                  // specify assay, do a console.log on newdoc
                  res.send(doc)
                }
              })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating item'
      })
    }
  }
}
