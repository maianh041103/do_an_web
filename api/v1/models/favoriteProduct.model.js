const mongoose = require('mongoose');

const favoriteProductSchema = new mongoose.Schema({
  productId: Array,
  accountId: String
}, {
  timestamps: true
})

const FavoriteProduct = mongoose.model("FavoriteProduct", favoriteProductSchema, "favoriteProducts");
module.exports = FavoriteProduct;