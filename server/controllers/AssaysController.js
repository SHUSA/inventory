const Assay = require('mongoose').model('Assay')

module.exports = {
  async index (req, res) {
    Assay.find({}).sort({name: -1}, (err, doc) => {
      if (err) {
        console.log(err)
        res.status(500).send({
          error: 'An error occured fetching assays'
        })
      } else {
        res.send(doc)
      }
    })
  },

  async show (req, res) {
    const assay = req.body._id
    
    Assay.find({})
  },

  async post (req, res) {

  },

  async put (req, res) {

  }
}
