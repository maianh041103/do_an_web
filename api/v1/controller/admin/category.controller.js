const ProductCategory = require('../../models/productCategory.model');
const Product = require('../../models/product.model');
const Account = require('../../models/account.model');

const createTreeHelper = require('../../../../helper/createTree.helper');
const subCategoryHelper = require('../../../../helper/subCategory.helper');

//[GET] /admin/productCategory
module.exports.index = async (req, res) => {
  try {
    let listCategory = await ProductCategory.find({
      deleted: false
    });

    let newListCategory = [];

    for (let category of listCategory) {
      let newCategory = {
        id: category.id,
        title: category.title,
        parentId: category.parentId,
        description: category.description,
        image: category.image,
        status: category.status,
        properties: category.properties,
        deleted: category.deleted,
        slug: category.slug
      }

      if (category.createdBy.account_id) {
        const account = await Account.findOne({
          _id: category.createdBy.account_id
        }).select("fullName");
        if (account) {
          newCategory.createdBy = {
            fullName: account.fullName,
            account_id: category.createdBy.account_id,
            createdAt: category.createdBy.createdAt
          }
        }
      }

      if (category.updatedBy.account_id) {
        const account = await Account.findOne({
          _id: category.updatedBy.account_id
        }).select("fullName");
        if (account) {
          newCategory.updatedBy = {
            fullName: account.fullName,
            account_id: category.updatedBy.account_id,
            updatedAt: category.updatedBy.updatedAt
          }
        }
      }
      newListCategory.push(newCategory);
    }

    newListCategory = createTreeHelper.createTree(newListCategory);

    res.json({
      productCategory: newListCategory
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không tìm thấy danh mục sản phẩm"
    })
  }
}

//[GET] /admin/productCategory/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findOne({
      _id: req.params.id,
      deleted: false
    });
    let newProductCategory = {
      title: productCategory.title,
      parentId: productCategory.parentId,
      description: productCategory.description,
      image: productCategory.image,
      status: productCategory.status,
      position: productCategory.position,
      properties: productCategory.properties, //chứa các thuộc tính của sản phẩm thuộc danh mục trên
      deleted: productCategory.deleted,
      deletedAt: productCategory.deletedAt,
      slug: productCategory.slug,
    }
    if (productCategory.parentId) {
      const productCategoryParent = await ProductCategory.findOne({
        _id: productCategory.parentId,
        deleted: false
      });
      if (productCategoryParent)
        newProductCategory.parentName = productCategoryParent.title;
    }
    if (productCategory.createdBy) {
      const accountCreate = await Account.findOne({
        _id: productCategory.createdBy.account_id
      });
      if (accountCreate) {
        newProductCategory.createdBy = {
          accountName: accountCreate.fullName,
          createdAt: productCategory.createdBy.createdAt
        }
      }
    }
    if (productCategory.updatedBy) {
      const accountUpdate = await Account.findOne({
        _id: productCategory.updatedBy.account_id
      });
      if (accountUpdate) {
        newProductCategory.updatedBy = {
          accountName: accountUpdate.fullName,
          updatedAt: productCategory.updatedBy.updatedAt
        }
      }
    }
    if (productCategory.deletedBy) {
      const accountDelete = await Account.findOne({
        _id: productCategory.deletedBy.account_id
      });
      if (accountDelete) {
        newProductCategory.deletedBy = {
          accountName: accountDelete.fullName,
          deletedAt: productCategory.deletedAt.deletedAt
        }
      }
    }
    res.json({
      code: 200,
      productCategory: newProductCategory
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không tìm được danh mục sản phẩm"
    });
  }
}

//[POST] /admin/productCategory/add
module.exports.add = async (req, res) => {
  try {
    let data = req.body;
    data.createdBy = {
      account_id: req.user.id,
      createdAt: new Date()
    }
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
    dataUpdate.updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }
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

//[PATCH] /admin/productCategory/uploadImage
module.exports.uploadImage = async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "Upload ảnh thành công",
      image: req.body.image
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Upload ảnh thất bại"
    });
  }
}

//[DELETE] /admin/productCategory/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    //Lấy danh mục con thuộc danh mục vừa xóa
    let listProductCategory = await subCategoryHelper.subCategory(id, ProductCategory);
    let listProductCategoryId = listProductCategory.map(item => {
      return item.id;
    })
    listProductCategoryId.push(id);
    //End lấy danh mục con thuộc danh mục vừa xóa

    //Xóa danh mục và xóa con của danh mục đó
    await ProductCategory.updateOne({
      _id: { $in: listProductCategoryId }
    }, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: {
        account_id: req.user.id,
        deletedAt: new Date()
      }
    });
    //End xóa danh mục và xóa con của danh mục đó

    // Xóa sản phẩm thuộc danh mục đó
    const products = await Product.find({
      productCategoryId: { $in: listProductCategoryId }
    });
    const listProductId = products.map(item => item.id);

    await Product.updateMany({
      _id: { $in: listProductId }
    }, {
      deleted: true,
      deletedAt: new Date()
    });
    // End xóa sản phẩm thuộc danh mục đó

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