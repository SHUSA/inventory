const Order = require('mongoose').model('Order')

module.exports = {
  async index (req, res) {
    try {
      await Order.find()
        .sort({updatedAt: 1})
        .exec((err, doc) => {
          if (err) {
            console.log(err)
            res.send(err.message)
          } else {
            res.send(doc)
          }
        })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching orders'
      })
    }
  },

  async show (req, res) {
    try {
      await Order.find({_id: req.params.orderId})
        .exec((err, doc) => {
          if (err) {
            console.log(err)
            res.send(err.message)
          } else {
            res.send(doc)
          }
        })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching order'
      })
    }
  },

  async post (req, res) {
    const orderData = {
      time: Date.now()
    }
    const newOrder = new Order(orderData)

    try {
      await newOrder.save((err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured creating order'
      })
    }
  },

  async put (req, res) {
    try {
      Order.findOneAndUpdate({_id: req.params.orderId},
        req.body.params.order, (err, doc) => {
          if (err) {
            console.log(err)
            res.send(err.message)
          } else {
            console.log(doc)
            res.send(doc)
          }
        })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured changing order'
      })
    }
  },
  // no put statement because orders are updated through items?
  async remove (req, res) {
    // delete order if entry array is emmpty
    try {
      await Order.findByIdAndRemove({_id: req.params.orderId}, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send('order deleted')
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured deleting order'
      })
    }
  }
}
