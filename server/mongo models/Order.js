const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  entry: [{
    item: {type: Schema.Types.ObjectId},
    updatedAt: {type: Date},
    currentStock: {type: Number},
    comment: {type: String}
  }],
  createdAt: {type: Date, default: Date.now},
  completed: {type: Boolean, default: false},
  completeDate: {type: Date}
})

module.exports = mongoose.model('Order', OrderSchema)
