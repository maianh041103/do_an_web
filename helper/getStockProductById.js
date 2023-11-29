const Product = require('../api/v1/models/product.model');

module.exports.getStockById = async (id, childTitle) => {
  let productGet = await Product.findOne({
    _id: id,
    deleted: false
  });

  if (childTitle !== "none") {
    productGet = productGet.group.find(item => {
      return item.childTitle === childTitle;
    })
  }
  return productGet.stock;
}