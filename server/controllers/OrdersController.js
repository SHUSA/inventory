const { Order } = require('../models')
const { Entry } = require('../models')
const moment = require('moment')

module.exports = {
  async index (req, res) {
    try {
      let orders = await Order.findAll({
        where: {
          active: req.query.active
        },
        order: [
          ['createdAt', 'DESC']
        ]
      })
      res.send(orders)
    } catch (error) {
      res.status(500).send(error.errors)
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
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    try {
      const order = await Order.create(req.body)
      res.send(order)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    const order = req.body
    const oneMonthAgo = moment().subtract(30, 'days').format()
    if (order.createdAt < oneMonthAgo && order.completed) {
      res.status(500).send([{ message: 'Order is completed and older than one month. Unable to delete.' }])
    }
    try {
      await Order.update(order, {
        where: {
          id: req.params.orderId
        }
      })
      res.send(order)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async remove (req, res) {
    try {
      await Order.destroy({
        where: {
          id: req.params.orderId
        }
      })
      res.send(req.body)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  }
}
