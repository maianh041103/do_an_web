const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  productCategoryId: {
    type: String,
    default: ""
  },
  description: String,
  images: Array,
  group: [
    {
      childTitle: String,
      price: Number,
      stock: Number, //Số lượng còn
      quantity: Number, //Tổng số lượng => Số lượng đã bán
    }
  ],
  price: Number,
  stock: Number, //Số lượng còn
  quantity: Number, //Tổng số lượng => Số lượng đã bán
  featured: String,
  status: String,
  properties: Array, //chứa các thuộc tính của sản phẩm thuộc danh mục trên
  rate: Number,
  deleted: {
    type: Boolean,
    default: ""
  },
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      createdAt: new Date()
    }
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ],
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
})

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;