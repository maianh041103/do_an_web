const Product = require("../../models/product.model");
const ProductCategory = require('../../models/productCategory.model');
const FeedBack = require('../../models/feedback.model');
const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const Account = require('../../models/account.model');

const treeHelper = require('../../../../helper/createTree.helper');
const subCategoryHelper = require('../../../../helper/subCategory.helper');
const paginationHelper = require('../../../../helper/pagination.helper');
const searchHelper = require('../../../../helper/search.helper');
const minMaxPrice = require('../../../../helper/minMaxPrice.helper');
const calcPriceNew = require('../../../../helper/calcPriceNew.helper');
const productsBestSellerHelper = require('../../../../helper/productBestSeller.helper');
const minPriceHelper = require('../../../../helper/findMinPrice.helper');

//[GET] /api/v1/products
//?sortKey=""&sortValue=""&search=""&priceMax=""&priceMin=""&rate=""&categoryParent=""&categoryChild=""&page=""&limit=""
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

  //Search
  if (req.query.search) {
    const seachObject = searchHelper(req.query);
    find.title = seachObject.regex;
  }
  //End Search

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
  const categoryChild = req.query.categoryChild;
  const categoryParent = req.query.categoryParent;
  if (categoryChild) {
    const listCategoryChild = categoryChild.split(",");
    find["productCategoryId"] = { $in: listCategoryChild };
  }
  else if (categoryParent) {
    const listCategoryChildren = await subCategoryHelper.subCategory(categoryParent, ProductCategory);
    const listCategoryChildrenId = listCategoryChildren.map(item => item.id);
    listCategoryChildrenId.push(categoryParent);
    find["productCategoryId"] = { $in: listCategoryChildrenId };
  }
  //End Category Filter

  //Min max price
  let products = await Product.find(find);
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || 100000000000000000000000;
  products = minMaxPrice(products, minPrice, maxPrice);
  const listProductId = products.map(item => item.id);
  console.log(listProductId);
  //End min max price



  //Pagination
  const countProducts = listProductId.length;
  let objectPagination = {
    limit: 10,
    currentPage: 1
  }
  objectPagination = paginationHelper(objectPagination, req.query, countProducts);
  //End pagination

  let resultProduct = await Product.find({
    _id: { $in: listProductId }
  }).skip(objectPagination.skip)
    .limit(objectPagination.limit)
    .sort(sort);

  let newResultProduct = [];
  for (let product of resultProduct) {
    let newProduct = {
      _id: product.id,
      title: product.title,
      description: product.description,
      images: product.images,
      price: product.price,
      stock: product.stock,
      quantity: product.quantity,
      featured: product.featured,
      status: product.status,
      properties: product.properties,
      deleted: product.deleted,
      slug: product.slug,
      rate: product.rate,
      discountPercent: product.discountPercent
    }

    newProduct = calcPriceNew.calc(newProduct);

    // console.log(newProduct);


    let result = minPriceHelper.findMinPrice(newProduct);
    //console.log(result);

    newProduct.buyed = productsBestSellerHelper.productSold(newProduct);
    const productCategory = await ProductCategory.findOne({
      _id: product.productCategoryId,
      deleted: false
    });
    if (productCategory)
      newProduct.productCategoryTitle = productCategory.title;
    else
      newProduct.productCategoryTitle = "";
    newResultProduct.push(newProduct);
  }

  res.json({
    totalPage: countProducts,
    products: newResultProduct,
    productCategory: productCategory
  })
}

//[GET] /api/v1/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let product = await Product.findOne({
      deleted: false,
      status: "active",
      _id: req.params.id
    });

    let newProduct = {
      _id: product.id,
      title: product.title,
      description: product.description,
      images: product.images,
      group: product.group,
      price: product.price,
      stock: product.stock,
      quantity: product.quantity,
      featured: product.featured,
      status: product.status,
      properties: product.properties,
      deleted: product.deleted,
      slug: product.slug,
      rate: product.rate,
      discountPercent: product.discountPercent
    }

    newProduct.buyed = productsBestSellerHelper.productSold(newProduct);
    const productCategory = await ProductCategory.findOne({
      _id: product.productCategoryId,
      deleted: false
    });
    if (productCategory)
      newProduct.productCategoryTitle = productCategory.title;
    else
      newProduct.productCategoryTitle = "";

    newProduct = calcPriceNew.calc(newProduct);

    const feedbacks = await FeedBack.find({
      deleted: false,
      productId: req.params.id
    });

    let newFeedbacks = [];

    for (const feedback of feedbacks) {
      let newFeedback = {
        productId: feedback.productId,
        orderId: feedback.orderId,
        comment: feedback.comment,
        rate: feedback.rate,
        deleted: feedback.deleted,
      }
      const order = await Order.findOne({
        _id: feedback.orderId,
        deleted: false,
      });
      const cart = await Cart.findOne({
        _id: order.cart_id,
        deleted: false
      });
      const account = await Account.findOne({
        _id: cart.account_id
      });
      newFeedback.fullName = account.fullName;
      newFeedbacks.push(newFeedback);
    }

    res.json({
      code: 200,
      newProduct: newProduct,
      newFeedbacks: newFeedbacks
    })

  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không tìm thấy sản phẩm"
    })
  }
}

//[GET] /api/v1/products/compare
module.exports.compare = async (req, res) => {
  const ids = req.body.ids;
  let products = await Product.find({
    _id: { $in: ids }
  });

  for (let product of products) {
    product = calcPriceNew.calc(product);
    product.buyed = productsBestSellerHelper.productSold(product);
    const productCategory = await ProductCategory.findOne({
      _id: product.productCategoryId,
      deleted: false
    });
    if (productCategory)
      product.productCategoryTitle = productCategory.title;
    else
      product.productCategoryTitle = "";
  }

  res.json({
    code: 200,
    products: products
  })
}
