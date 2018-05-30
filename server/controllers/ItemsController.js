const Item = require('mongoose').model('Item')
const Vendor = require('mongoose').model('Vendor')
const Order = require('mongoose').model('Order')
const Assay = require('mongoose').model('Assay')
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
    const itemData = {
      name: item.name,
      assay: item.assay,
      vendor: item.vendor,
      catalogNumber: item.catalogNumber,
      itemDescription: item.itemDescription,
      currentStock: item.currentStock,
      reactionsPerItem: item.reactionsPerItem,
      weeksOfSafetyStock: item.weeksOfSafetyStock,
      leadTimeDays: item.leadTimeDays,
      weeksOfReorder: item.weeksOfReorder,
      comment: item.comment,
      active: true
    }
    const newItem = new Item(itemData)

    try {
      await newItem.save((err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          Assay.findOneAndUpdate({name: item.assay},
            {$push: {items: doc._id}}, {new: true}, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                // specify assay, do a console.log on newdoc
                console.log('item inserted into assay')
              }
            })
          Vendor.findOneAndUpdate({ name: item.vendor },
            { $push: { items: doc._id } }, { new: true }, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                // specify assay, do a console.log on newdoc
                console.log('item inserted into vendor')
              }
            })
          Order.find().sort({_id: -1}).limit(1)
            .updateOne({ $push: { items: doc._id } },
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
    const itemData = {
      name: item.name,
      assay: item.assay,
      vendor: item.vendor,
      catalogNumber: item.catalogNumber,
      itemDescription: item.itemDescription,
      currentStock: item.currentStock,
      reactionsPerItem: item.reactionsPerItem,
      weeksOfSafetyStock: item.weeksOfSafetyStock,
      leadTimeDays: item.leadTimeDays,
      weeksOfReorder: item.weeksOfReorder,
      comment: item.comment,
      active: item.active
    }
    // get ID from req somehow
    const tempId = req.params.itemId
    try {
      // push new quantity in currentStock either here or before passing
      await Item.update({_id: tempId}, itemData, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          Assay.findOneAndUpdate({ name: item.assay },
            { $push: { items: tempId } }, { new: true }, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                // specify assay, do a console.log on newdoc
                console.log('item inserted into assay')
              }
            })
          Vendor.findOneAndUpdate({ name: item.vendor },
            { $push: { items: tempId } }, { new: true }, (err, newdoc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                // specify assay, do a console.log on newdoc
                console.log('item inserted into vendor')
              }
            })
          Order.find().sort({ _id: -1 }).limit(1)
            .updateOne({ $push: { items: tempId } },
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
