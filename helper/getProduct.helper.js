const ProductCategory = require('../api/v1/models/productCategory.model');

const calcPriceNew = require('./calcPriceNew.helper');
const minPriceHelper = require('./findMinPrice.helper');
const productsBestSellerHelper = require('./productBestSeller.helper');

module.exports.getProduct = async (product) => {
  let newProduct = {
    _id: product.id,
    title: product.title,
    description: product.description,
    images: product.images,
    price: product.price,
    stock: product.stock,
    quantity: product.quantity,
    group: product.group,
    featured: product.featured,
    status: product.status,
    properties: product.properties,
    deleted: product.deleted,
    slug: product.slug,
    rate: product.rate,
    productCategoryId: product.productCategoryId,
    discountPercent: product.discountPercent
  }

  newProduct = calcPriceNew.calc(newProduct);

  newProduct.minPrice = minPriceHelper.findMinPrice(newProduct);

  newProduct.buyed = productsBestSellerHelper.productSold(newProduct);
  const productCategory = await ProductCategory.findOne({
    _id: product.productCategoryId,
    deleted: false
  });
  if (productCategory)
    newProduct.productCategoryTitle = productCategory.title;
  else
    newProduct.productCategoryTitle = "";
  return newProduct;
}