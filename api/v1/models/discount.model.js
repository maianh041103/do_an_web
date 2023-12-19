const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  title: String,
  description: String,
  discountPercent: Number,
  conditionRank: {
    type: Number,
    default: 0 //Đồng:0, bạc:1, vàng:2, kim cương:3 
  },
  specialDay: {
    type: "String",
    default: "normal" //normal, special,...
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: {
    account_id: String,
    updatedAt: Date
  }
})

const Discount = mongoose.model('Discount', discountSchema, 'discounts');

module.exports = Discount;  