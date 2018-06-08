const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: {type: String, required: true},
  vendor: {type: String, required: true},
  assay: {type: String, required: true},
  catalogNumber: {type: String, required: true, unique: true},
  itemDescription: {type: String},
  currentStock: {type: Number},
  reactionsPerItem: {type: Number},
  weeksOfSafetyStock: {type: Number},
  leadTimeDays: {type: Number},
  weeksOfReorder: {type: Number},
  comment: {type: String},
  updatedAt: {type: Date, default: Date.now},
  safetyStock: {type: Number, default: 0},
  reorderPoint: {type: Number, default: 0},
  reorderQuantity: {type: Number, default: 0},
  active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Item', ItemSchema)
