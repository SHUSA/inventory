const { Entry } = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let entries = await Entry.findAll()
      res.send(entries)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async show (req, res) {
    try {
      let entry = await Entry.findById(req.params.entryId)
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async post (req, res) {
    try {
      let entry = []
      entry = await req.body.forEach(newEntry => Entry.create(newEntry))
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    try {
      // update each entry
      await req.body.forEach(entry => {
        Entry.update(entry, {
          where: {
            id: entry.id
          }
        }).then(foundItem => {
          // create entry if does not exist
          if (foundItem[0] === 0) {
            Entry.create(entry)
          }
        })
      })
      res.send(req.body)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async remove (req, res) {
    try {
      await Entry.destroy({
        where: {
          id: req.query.entries
        }
      })
      res.send(req.body)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  }
}
