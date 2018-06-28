const { Order } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured fetching orders'
      })
    }
  },

  async show (req, res) {
    try {
      
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
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured creating order'
      })
    }
  },

  async put (req, res) {
    try {
      
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
      
    } catch (error) {
      res.status(500).send({
        error: 'An error occured deleting order'
      })
    }
  }
}
