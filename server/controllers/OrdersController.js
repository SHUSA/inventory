const Order = require('mongoose').model('Order')

module.exports = {
  async index (req, res) {
    try {
      await Order.find({})
        .populate(['items'])
        .sort({time: 1}, (err, doc) => {
          if (err) {
            console.log(err)
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
    const order = req.body

    try {
      await Order.find({_id: order.id})
        .populate(['items'])
        .exec((err, doc) => {
          if (err) {
            console.log(err)
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
      await Order.findByIdAndRemove({_id: req.body.id}, (err, doc) => {
        if (err) {
          console.log(err)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured deleting order'
      })
    }
  }
}
