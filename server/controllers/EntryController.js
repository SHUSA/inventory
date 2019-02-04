const { Entry } = require('../models')
// to do: eager loading for items?

module.exports = {
  async index (req, res) {
    try {
      let entries = await Entry.findAll({
        where: {
          active: req.query.active
        }
      })
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
      let newEntries = req.body
      for (let i = 0; i < newEntries.length; i++) {
        entry.push(await Entry.create(newEntries[i]))
      }
      res.send(entry)
    } catch (error) {
      console.log(error)
      res.status(500).send(error.errors)
    }
  },

  async put (req, res) {
    let entries = req.body
    try {
      // update each entry
      for (let i = 0; i < entries.length; i++) {
        await Entry.update(entries[i], {
          where: {
            id: entries[i].id
          }
        }).then(foundItem => {
          // create entry if does not exist
          if (foundItem[0] === 0) {
            Entry.create(entries[i])
          }
        })
      }
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
