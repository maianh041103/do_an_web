const Product = require("../../models/product.model");
const ProductCategory = require('../../models/productCategory.model');
const FeedBack = require('../../models/feedback.model');

const treeHelper = require('../../../../helper/createTree.helper');
const subCategoryHelper = require('../../../../helper/subCategory.helper');
const paginationHelper = require('../../../../helper/pagination.helper');
const searchHelper = require('../../../../helper/search.helper');
const minMaxPrice = require('../../../../helper/minMaxPrice.helper');

//[GET] /api/v1/products
//?sortKey=""&sortValue=""&search=""&priceMax=""&priceMin=""&rate=""&category=""&page=""&limit=""
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    status: "active",
  }

  //Lấy category hiển thị theo hình cây
  let productCategory = await ProductCategory.find({
    deleted: false,
    status: "active"
  });
  productCategory = treeHelper.createTree(productCategory, "");
  //End lấy category hiển thị hình cây

  //SearchParams
  console.log(req.query);
  //End searchParams

  //Search
  if (req.query.search) {
    const seachObject = searchHelper(req.query);
    find.title = seachObject.regex;
  }
  //End Search

  //Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = {
    limit: 2,
    currentPage: 1
  }
  objectPagination = paginationHelper(objectPagination, req.query, countProducts);
  //End pagination

  //Sort
  sortKey = req.query.sortKey;
  sortValue = req.query.sortValue;
  const sort = {};
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue;
  }
  //End Sort

  //Rate filter
  if (req.query.rate) {
    const rate = parseFloat(req.query.rate);
    find["rate"] = { $gte: rate }
  }
  //End rate filter

  //Category Filter
  const category = req.query.category;
  if (category) {
    const listCategoryChildren = await subCategoryHelper.subCategory(category, ProductCategory);
    const listCategoryChildrenId = listCategoryChildren.map(item => item.id);
    listCategoryChildrenId.push(category);
    find["productCategoryId"] = { $in: listCategoryChildrenId };
  }
  //End Category Filter

  let products = await Product.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limit)
    .sort(sort);

  //Min max price
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || 100000000000000000000000;
  products = minMaxPrice(products, minPrice, maxPrice);
  //End min max price

  res.json({
    totalPage: countProducts,
    products: products,
    productCategory: productCategory
  })
}

//[GET] /api/v1/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      deleted: false,
      status: "active",
      _id: req.params.id
    });

    const feedbacks = await FeedBack.find({
      deleted: false,
      productId: req.params.id
    });

    res.json({
      code: 200,
      product: product,
      feedbacks: feedbacks
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy sản phẩm"
    })
  }
}

//[GET] /api/v1/products/compare
module.exports.compare = async (req, res) => {
  const ids = req.body.ids;
  const products = await Product.find({
    _id: { $in: ids }
  });
  res.json({
    code: 200,
    products: products
  })
}
