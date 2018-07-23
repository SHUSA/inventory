const { Order } = require('../models')
const { Entry } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let orders = await Order.findAll({
        order: [
          ['createdAt', 'DESC']
        ]
      })
      res.send(orders)
    } catch (error) {
      res.status(500).send(error.message)
    }
  },

  async show (req, res) {
    try {
      let entries = null
      await Order.find({
        where: {
          id: req.params.orderId
        },
        include: [Entry]
      }).then(orderEntry => {
        entries = orderEntry
      })
      res.send(entries)
    } catch (error) {
      res.status(500).send(error.message)
    }
  },

  async post (req, res) {
    try {
      const order = await Order.create(req.body)
      res.send(order)
    } catch (error) {
      res.status(500).send(error.message)
    }
  },

  async put (req, res) {
    try {
      await Order.update(req.body, {
        where: {
          id: req.params.orderId
        }
      })
      res.send(req.body)
    } catch (error) {
      res.status(500).send(error.message)
    }
  },

  async remove (req, res) {
    // delete order there are no associated entries
    try {
      // let order = await Order.findAll({
      //   limit: 1,
      //   order: ['createdAt', 'DESC']
      // })
      // let entries = await order[0].getEntries
      // if (entries.length === 0) {
      //   await order[0].destroy()
      //   res.send(`Destroyed order created at ${order[0].createdAt}.`)
      // } else {
      //   res.send(order[0])
      // }
      res.send(null)
    } catch (error) {
      res.status(500).send({
        error: 'An error occured deleting order'
      })
    }
  }
}
