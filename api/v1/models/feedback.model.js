const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
  productId: String,
  orderId: String,
  comment: String,
  rate: Number,
  //status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
}, {
  timestamps: true
})

const FeedBack = mongoose.model("FeedBack", feedBackSchema, "feedBacks");

module.exports = FeedBack;