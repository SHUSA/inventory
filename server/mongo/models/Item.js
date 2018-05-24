const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: {type: String, required: [true, 'An item needs a name']},
  catalogNumber: {type: String, required: [true, 'Need cats for the log'], unique: [true, 'That cat already exists']},
  itemDescription: {type: String},
  currentStock: {type: Array},
  reactionsPerItem: {type: Number},
  weeksOfSafetyStock: {type: Number},
  leadTimeDays: {type: Number},
  weeksOfReorder: {type: Number},
  comment: {type: String},
  updatedAt: {type: Date}
})

module.exports = mongoose.model('Item', ItemSchema)
