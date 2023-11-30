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
  try {
    const data = req.body;
    const newProductCategory = new ProductCategory(data);
    await newProductCategory.save();
    res.json({
      code: 200,
      productCategory: newProductCategory
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thêm danh mục sản phẩm thất bại"
    });
  }
}

//[PATCH] /admin/productCategory/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const dataUpdate = req.body;
    await ProductCategory.updateOne({
      _id: id
    }, dataUpdate);
    const newData = await ProductCategory.findOne({
      _id: id
    });
    res.json({
      code: 200,
      productCategory: newData
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật danh mục sản phẩm thất bại"
    });
  }
}

//[DELETE] /admin/productCategory/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await ProductCategory.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });
    res.json({
      code: 200,
      message: "Xóa danh mục sản phẩm thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa danh mục sản phẩm thất bại"
    });
  }
}