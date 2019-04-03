const { Order } = require('../models')
const { Entry } = require('../models')
const moment = require('moment')

module.exports = {
  async index (req, res) {
    const search = {
      active: req.query.active
    }
    if (!req.user.Department.all) {
      search.DepartmentId = req.user.DepartmentId
    }
    try {
      let orders = await Order.findAll({
        where: search,
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
      const order = await Order.create({
        DepartmentId: req.user.DepartmentId
      })
      res.send(order)
    } catch (error) {
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    const order = req.body
    const oneMonthAgo = moment().subtract(30, 'days').toISOString()
    let updatedOrder = null
    try {
      updatedOrder = await Order.findById(req.params.orderId)
        .then(foundOrder => {
          foundOrder = foundOrder.toJSON()
          // only allow edit if subadmin or above AND if order is not completed AND not more than 30 days old
          if (order.createdAt < oneMonthAgo && foundOrder.completed) {
            return res.status(500).send({
              error: 'Order is completed and older than one month. Unable to edit.'
            })
          }
          Order.update(order, {
            where: {
              id: req.params.orderId
            },
            returning: true,
            plain: true
          })
        })
      res.send(updatedOrder)
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
