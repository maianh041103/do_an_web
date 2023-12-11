const ProductCategory = require('../api/v1/models/productCategory.model');
const Product = require('../api/v1/models/product.model');

const calcPriceNew = require('./calcPriceNew.helper');
const minPriceHelper = require('./findMinPrice.helper');
const productsBestSellerHelper = require('./productBestSeller.helper');
const getProductHelper = require('./getProduct.helper');


module.exports.getListProduct = async (products) => {
  let resultProduct = [];
  for (let product of products) {
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
    resultProduct.push(newProduct);
  }
  return resultProduct;
}


module.exports.getListProductsCart = async (listProductId) => {
  let products = [];
  for (let i = 0; i < listProductId.length; i++) {
    let product = {
      product_id: listProductId[i].product_id,
      childTitle: listProductId[i].childTitle,
      quantity: listProductId[i].quantity
    }
    let inforProduct = await Product.findOne({
      _id: listProductId[i].product_id,
      deleted: false
    });
    inforProduct = await getProductHelper.getProduct(inforProduct);
    let newInforProduct = {
      title: inforProduct.title,
      description: inforProduct.description,
      images: inforProduct.images,
      price: inforProduct.price,
      stock: inforProduct.stock,
      quantity: inforProduct.quantity,
      featured: inforProduct.featured,
      status: inforProduct.status,
      properties: inforProduct.properties,
      deleted: inforProduct.deleted,
      slug: inforProduct.slug,
      rate: inforProduct.rate,
      discountPercent: inforProduct.discountPercent,
      priceNew: inforProduct.priceNew,
      //minPrice: inforProduct.minPrice,
      //buyed: inforProduct.buyed,
      productCategoryTitle: inforProduct.productCategoryTitle
    }
    if (listProductId[i].childTitle !== "none") {
      let productChild = inforProduct.newGroup.find(item => {
        return item.childTitle === listProductId[i].childTitle;
      })
      newInforProduct.productChild = productChild;

      let totalPrice = productChild.priceNew * product.quantity;
      product.totalPrice = totalPrice;
    }
    else {
      let totalPrice = newInforProduct.priceNew * product.quantity;
      product.totalPrice = totalPrice;
    }
    product.inforProduct = newInforProduct;

    products.push(product);
  }
  return products;
}