const { Order } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let orders = await Order.findAll({
        order: [
          ['updatedAt', 'DESC']
        ]
      })
      res.send(orders)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching orders'
      })
    }
  },

  async show (req, res) {
    try {
      let order = await Order.findById(req.params.orderId)
      res.send(order)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching order'
      })
    }
  },

  async post (req, res) {
    try {
      const order = await Order.create(req.body)
      res.send(order)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured creating order'
      })
    }
  },

  async put (req, res) {
    try {
      const order = await Order.update(req.body, {
        where: {
          id: req.params.orderId
        }
      })
      res.send(order)
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
      let order = await Order.findAll({
        limit: 1,
        order: ['createdAt', 'DESC']
      })
      let entries = await order[0].getEntries()
      if (entries.length === 0) {
        await order[0].destroy()
        res.send(`Destroyed order created at ${order[0].createdAt}.`)
      } else {
        res.send(order[0])
      }
    } catch (error) {
      res.status(500).send({
        error: 'An error occured deleting order'
      })
    }
  }
}
