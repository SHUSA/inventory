const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  items: [{
    _id: {type: Schema.Types.ObjectId, ref: 'Item'},
    name: {type: String},
    assay: {type: String},
    vendor: {type: String},
    catalogNumber: {type: String},
    itemDescription: {type: String},
    reorderQuantity: {type: Number},
    currentStock: {type: Number},
    comment: {type: String},
    updatedAt: {type: Date}
  }],
  createdAt: {type: Date, default: Date.now},
  completed: {type: Boolean, default: false},
  completeDate: {type: Date}
})

module.exports = mongoose.model('Order', OrderSchema)
