const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  items: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  createdAt: {type: Date, default: Date.now},
  completed: {type: Boolean, default: false},
  completeDate: {type: Date}
})

module.exports = mongoose.model('Order', OrderSchema)
