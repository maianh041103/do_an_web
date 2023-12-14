const Product = require('../../models/product.model');
const calcPriceNewHelper = require('../../../../helper/calcPriceNew.helper');
const getListProductHelper = require('../../../../helper/getListProduct.helper');

//[GET] /admin/products/
module.exports.index = async (req, res) => {
  try {
    const listProducts = await Product.find({
      deleted: false
    });
    const newListProducts = await getListProductHelper.getListProductAdmin(listProducts);
    res.json({
      listProducts: newListProducts
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Tìm kiếm danh sách sản phẩm thất bại"
    });
  }
}

//[POST] /admin/products/add
module.exports.add = async (req, res) => {
  try {
    if (req.body.group && req.body.group.length > 0) {
      for (let i = 0; i < req.body.group.length; i++) {
        req.body.group[i].price = parseInt(req.body.group[i].price);
        req.body.group[i].stock = parseInt(req.body.group[i].stock);
        req.body.group[i].quantity = parseInt(req.body.group[i].quantity);
      }
    }
    else {
      req.body.price = parseInt(req.body.price);
      req.body.stock = parseInt(req.body.stock);
      req.body.quantity = parseInt(req.body.quantity);
    }
    if (req.body.discountPercent) {
      req.body.discountPercent = parseInt(req.body.discountPercent);
    }

    req.body.createdBy = {
      account_id: req.user.id,
      createdAt: new Date()
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({
      code: 200,
      message: "Thêm mới sản phẩm thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Thêm mới sản phẩm thất bại"
    });
  }
}

//[PATCH] /admin/products/uploadImage
module.exports.uploadImage = async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "Upload ảnh thành công",
      images: req.body.images
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Upload ảnh thất bại"
    });
  }
}

//[PATCH] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    if (req.body.group && req.body.group.length > 0) {
      for (let i = 0; i < req.body.group.length; i++) {
        if (req.body.group[i].price)
          req.body.group[i].price = parseInt(req.body.group[i].price);
        if (req.body.group[i].stock)
          req.body.group[i].stock = parseInt(req.body.group[i].stock);
        if (req.body.group[i].quantity)
          req.body.group[i].quantity = parseInt(req.body.group[i].quantity);
      }
    }
    else {
      if (req.body.price)
        req.body.price = parseInt(req.body.price);
      if (req.body.stock)
        req.body.stock = parseInt(req.body.stock);
      if (req.body.quantity)
        req.body.quantity = parseInt(req.body.quantity);
    }
    if (req.body.discountPercent)
      req.body.discountPercent = parseInt(req.body.discountPercent);

    req.body.updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }

    await Product.updateOne({
      _id: req.params.id
    }, req.body);
    const newProduct = await Product.findOne({
      _id: req.params.id
    });
    res.json({
      newProduct: newProduct
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật sản phẩm thất bại"
    });
  }
}

//[DELETE] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await Product.updateOne({
      _id: req.params.id
    }, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: {
        account_id: req.user.id,
        deletedAt: new Date()
      }
    });
    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Xoá sản phẩm thất bại"
    })
  }
}