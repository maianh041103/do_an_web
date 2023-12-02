const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  account_id: String,
  products: [
    {
      product_id: String,
      childTitle: String,
      quantity: Number
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const Cart = new mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;