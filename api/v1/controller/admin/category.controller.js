const ProductCategory = require('../../models/productCategory.model');

const createTreeHelper = require('../../../../helper/createTree.helper');

//[GET] /admin/productCategory
module.exports.index = async (req, res) => {
  try {
    let listCategory = await ProductCategory.find({
      deleted: false
    });
    listCategory = createTreeHelper.createTree(listCategory);
    res.json({
      productCategory: listCategory
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy danh mục sản phẩm"
    })
  }
}

//[POST] /admin/productCategory/add
module.exports.add = async (req, res) => {
  console.log(req.body);
}