const Assay = require('mongoose').model('Assay')
const Item = require('mongoose').model('Item')
// const Issue = require('../models/Issues')

module.exports = {
  async index (req, res) {
    try {
      await Assay.find({active: req.query.status})
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
      console.log(error)
      res.status(500).send({
        error: 'An error occured fetching assays'
      })
    }
  },

  async show (req, res) {
    try {
      await Assay.find({_id: req.params.assayId})
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
        error: 'An error occured fetching assay'
      })
    }
  },

  async post (req, res) {
    const assay = req.body
    const assayData = {}
    for (let key in assay) {
      assayData[key] = assay[key]
    }
    const newAssay = new Assay(assayData)

    try {
      await newAssay.save((err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          res.send(doc)
          // res.redirect(where?)
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured saving assay'
      })
    }
  },

  async put (req, res) {
    const assay = req.body.params.assay
    const assayName = req.body.params.origName
    console.log('put assay')
    console.log(req.params)
    console.log(assay)
    console.log(assayName)
    try {
      await Assay.update({_id: req.params.assayId}, assay, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).send(err.message)
        } else {
          // update all items with the assay being updated
          Item.update({assay: assayName},
            {$set: {assay: assay.name, active: assay.active}},
            {multi: true})
            .exec((err, doc) => {
              if (err) {
                console.log(err)
                res.send(err.message)
              } else {
                res.send(assay)
              }
            })
        }
      })
    } catch (error) {
      res.status(500).send({
        error: 'An error occured updating assay'
      })
    }
  }
}
