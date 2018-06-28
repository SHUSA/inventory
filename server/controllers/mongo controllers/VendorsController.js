const Vendor = require('mongoose').model('Vendor')
const Item = require('mongoose').model('Item')

module.exports = {
  async index (req, res) {
    try {
      await Vendor.find({active: req.query.status})
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
    const vendorData = {}
    for (let key in vendor) {
      vendorData[key] = vendor[key]
    }
    const newVendor = new Vendor(vendorData)

    try {
      await newVendor.save((err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          res.send(doc)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving vendor'
      })
    }
  },

  async put (req, res) {
    const vendor = req.body.params.vendor
    const vendorName = req.body.params.origName
    try {
      await Vendor.update({_id: req.params.vendorId}, vendor, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          // update all items with the vendor being updated
          Item.update({vendor: vendorName},
            {$set: {vendor: vendor.name, active: vendor.active}},
            {multi: true})
            .exec((err, doc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                res.send(vendor)
              }
            })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating vendor'
      })
    }
  }
}
