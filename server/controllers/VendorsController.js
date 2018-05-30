const Vendor = require('mongoose').model('Vendor')

module.exports = {
  async index (req, res) {
    try {
      await Vendor.find()
        .populate(['items'])
        .sort({name: -1})
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
        error: 'An error occured fetching vendors'
      })
    }
  },

  async show (req, res) {
    try {
      await Vendor.find({_id: req.params.vendorId})
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
        error: 'An error occured fetching vendor'
      })
    }
  },

  async post (req, res) {
    const vendor = req.body
    const vendorData = {
      name: vendor.name,
      shortName: vendor.shortName,
      active: true
    }
    const newVendor = new Vendor(vendorData)

    try {
      await newVendor.save((err) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send('saved vendor')
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving vendor'
      })
    }
  },

  async put (req, res) {
    const vendor = req.body
    const vendorData = {
      name: vendor.name,
      shortName: vendor.shortName,
      active: vendor.active
    }

    try {
      await Vendor.update({_id: req.params.vendorId}, vendorData, (err, doc) => {
        if (err) {
          console.log(err)
          res.send(err.message)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating vendor'
      })
    }
  }
}
