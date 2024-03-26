const ProductCategory = require('../../models/productCategory.model');
const Product = require('../../models/product.model');
const SettingGeneral = require('../../models/settingGeneral.model');

const productsBestSellerHelper = require('../../../../helper/productBestSeller.helper');
const calcPriceNewHelper = require('../../../../helper/calcPriceNew.helper');
const getListProductHelper = require('../../../../helper/getListProduct.helper');

//[GET] /api/v1/home/productCategory
module.exports.productCategory = async (req, res) => {
  try {
    //Lấy ra danh mục sản phẩm
    const productCategorys = await ProductCategory.find({
      deleted: false,
      status: "active"
    })
    //End lấy ra danh mục sản phẩm
    res.json({
      code: 200,
      productCategorys: productCategorys
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}

//[GET] /api/v1/home/productBestSellers
module.exports.productBestSellers = async (req, res) => {
  try {
    //Lấy ra sản phẩm bán chạy nhất
    const productBestSellers = await Product.find({
      deleted: false,
      status: "active"
    })

    let newProductBestSellers = await getListProductHelper.getListProduct(productBestSellers);

    newProductBestSellers.sort((a, b) => {
      return b.productSold - a.productSold;
    })
    res.json({
      code: 200,
      newProduct: newProductBestSellers
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}

//[GET] /api/v1/home/productFeatureds
module.exports.productFeatureds = async (req, res) => {
  try {
    //Lấy ra sản phẩm nổi bật
    const productFeatureds = await Product.find({
      deleted: false,
      status: "active",
      featured: "1"
    })

    let newProductFeatureds = await getListProductHelper.getListProduct(productFeatureds);
    res.json({
      code: 200,
      newProduct: newProductFeatureds
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}

//[GET] /api/v1/home/productBestRate
module.exports.productBestRate = async (req, res) => {
  try {
    //Lấy ra sản phẩm sắp xếp theo rate
    const productBestRate = await Product.find({
      deleted: false,
      status: "active"
    }).sort({ rate: "desc" }).limit(3);

    let newProductBestRate = await getListProductHelper.getListProduct(productBestRate);
    ///End lấy sản phẩm sản phẩm theo rate
    res.json({
      code: 200,
      newProduct: newProductBestRate
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    })
  }
}

//[GET] /api/v1/
module.exports.index = async (req, res) => {
  //Lấy ra danh mục sản phẩm
  const productCategorys = await ProductCategory.find({
    deleted: false,
    status: "active"
  })
  //End lấy ra danh mục sản phẩm

  //Lấy ra sản phẩm bán chạy nhất
  const productBestSellers = await Product.find({
    deleted: false,
    status: "active"
  })

  let newProductBestSellers = await getListProductHelper.getListProduct(productBestSellers);

  newProductBestSellers.sort((a, b) => {
    return b.productSold - a.productSold;
  })
  //End lấy ra sp bán chạy nhất

  //Lấy ra sản phẩm nổi bật
  const productFeatureds = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  })

  let newProductFeatureds = await getListProductHelper.getListProduct(productFeatureds);
  //End lấy ra sản phẩm nổi bật 

  //Lấy ra sản phẩm sắp xếp theo rate
  const productBestRate = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ rate: "desc" }).limit(3);

  let newProductBestRate = await getListProductHelper.getListProduct(productBestRate);
  ///End lấy sản phẩm sản phẩm theo rate

  res.json({
    productCategorys: productCategorys,
    productBestSellers: newProductBestSellers, //Mảng sản phẩm sắp xếp theo số lượng đã bán giảm dẫn
    productFeatureds: newProductFeatureds,
    productBestRate: newProductBestRate
  });


}