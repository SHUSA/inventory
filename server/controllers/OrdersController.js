const Order = require('mongoose').model('Order')

module.exports = {
  async index (req, res) {
    try {
      await Order.find()
        .populate(['items'])
        .sort({time: 1})
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
        .populate(['items'])
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
      await newOrder.save((err) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send('saved order')
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured creating order'
      })
    }
  },
  // no put statement because orders are updated through items?
  async remove (req, res) {
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
