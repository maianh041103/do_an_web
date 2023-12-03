const ProductCategory = require('../../models/productCategory.model');
const Product = require('../../models/product.model');
const SettingGeneral = require('../../models/settingGeneral.model');

const productsBestSellerHelper = require('../../../../helper/productBestSeller.helper');
const calcPriceNewHelper = require('../../../../helper/calcPriceNew.helper');

//[GET] /api/v1/
module.exports.index = async (req, res) => {
  //Lấy ra danh mục sản phẩm
  const productCategorys = await ProductCategory.find({
    deleted: false,
    status: "active"
  })
  //End lấy ra danh mục sản phẩm

  //Lấy ra sản phẩm bán chạy nhất
  const productsBestSellers = await Product.find({
    deleted: false,
    status: "active"
  })

  for (let product of productsBestSellers) {
    product = calcPriceNewHelper.calc(product);
  }

  for (let product of productsBestSellers) {
    product.productSold = productsBestSellerHelper.productSold(product);
  }

  productsBestSellers.sort((a, b) => {
    return b.productSold - a.productSold;
  })
  //End lấy ra sp bán chạy nhất

  //Lấy ra sản phẩm nổi bật
  const productFeatureds = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  })

  for (let product of productFeatureds) {
    product = calcPriceNewHelper.calc(product);
  }
  //End lấy ra sản phẩm nổi bật 

  res.json({
    productCategorys: productCategorys,
    productsBestSellers: productsBestSellers, //Mảng sản phẩm sắp xếp theo số lượng đã bán giảm dẫn
    productFeatureds: productFeatureds,
  });


}