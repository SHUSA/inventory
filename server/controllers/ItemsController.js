const Item = require('mongoose').model('Item')
const Order = require('mongoose').model('Order')
// should probably search by assay or vendor then display items
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
    const itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    const newItem = new Item(itemData)

    if (newItem.reactionsPerItem !== 0) {
      // calculate safety stock, reorder point, reorder quantity
    }

    try {
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
    const itemData = {}
    for (let key in item) {
      itemData[key] = item[key]
    }
    itemData.updatedAt = Date.now()
    // get ID from req somehow
    const tempId = req.params.itemId
    try {
      // push new quantity in currentStock either here or before passing
      await Item.update({_id: tempId}, itemData, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          Order.find().sort({ _id: -1 }).limit(1)
            .updateOne({ $addToSet: { items: tempId } },
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
