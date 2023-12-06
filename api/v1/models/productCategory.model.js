const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parentId: {
    type: String,
    default: ""
  },
  description: String,
  image: String,
  status: String,
  position: Number,
  properties: Array, //chứa các thuộc tính của sản phẩm thuộc danh mục trên
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  updatedBy: {
    account_id: String,
    updatedAt: Date
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
})

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "productCategorys");

module.exports = ProductCategory;