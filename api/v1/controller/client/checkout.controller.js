const Product = require('../../models/product.model');
const Discount = require('../../models/discount.model');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');

const getStockProductByIdHelper = require('../../../../helper/getStockProductById');
const calcPriceNewHelper = require('../../../../helper/calcPriceNew.helper');
const getProductHelper = require('../../../../helper/getProduct.helper');

const getListProductHelper = require('../../../../helper/getListProduct.helper');

//[POST] /api/v1/checkout
module.exports.checkout = async (req, res) => {
  //Lấy ra sản phẩm 
  const listProduct = req.body.products;

  let products = await getListProductHelper.getListProductsCart(listProduct);

  const totalPriceOrder = products.reduce((calc, item) => {
    return calc + item.totalPrice;
  }, 0);

  //End lấy ra sản phẩm

  //Lấy ra mã giảm giá 
  const dateBuy = new Date();
  const day = dateBuy.getDate();
  const month = dateBuy.getMonth() + 1;
  let specialDay = "";
  if (day === month) {
    specialDay = "special";
  } else {
    specialDay = "normal";
  }
  const listDiscount = await Discount.find({
    deleted: false,
    conditionRank: { $lte: req.user.rank },
    $or: [{ specialDay: specialDay }, { specialDay: "normal" }]
  });
  //End lấy ra mã giảm giá

  res.json({
    totalPriceOrder: totalPriceOrder,
    listDiscount: listDiscount,
    user: req.user,
    products: products
    //Gửi thông tin user để điền trước lên form (user có thể sửa thông tin giao hàng hoặc không)
  });
}

//[GET] /api/v1/checkout/discount
module.exports.getDiscount = async (req, res) => {
  //Lấy ra mã giảm giá 
  const dateBuy = new Date();
  const day = dateBuy.getDate();
  const month = dateBuy.getMonth() + 1;
  let specialDay = "";
  if (day === month) {
    specialDay = "special";
  } else {
    specialDay = "normal";
  }
  const listDiscount = await Discount.find({
    deleted: false,
    conditionRank: { $lte: req.user.rank },
    $or: [{ specialDay: specialDay }, { specialDay: "normal" }]
  });

  res.json({
    listDiscount: listDiscount,
  });
  //End lấy ra mã giảm giá
}

//[POST] /api/v1/checkout/success
module.exports.order = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      account_id: req.user.id
    });

    const listProduct = req.body.products;

    let products = await getListProductHelper.getListProductsCart(listProduct);

    const data = {
      cart_id: cart.id,
      userInfo: {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
      },
      products: products,
      discountId: req.body.discountId,
      paymentMethod: req.body.paymentMethod
    }

    const newOrder = new Order(data);

    await newOrder.save();

    for (const product of products) {
      //Cập nhật giỏ hàng
      await Cart.updateOne({
        account_id: req.user.id
      }, {
        $pull: {
          products: {
            product_id: product.product_id,
            childTitle: product.childTitle
          }
        }
      });
      //End cập nhật giỏ hàng

      //Cập nhật số lượng còn lại
      const stock = await getStockProductByIdHelper.getStockById(product.product_id, product.childTitle);
      const newStock = stock - product.quantity;
      await Product.updateOne({
        _id: product.product_id,
        "group.childTitle": product.childTitle
      }, {
        $set: {
          "group.$.stock": newStock
        }
      });
      //End cập nhật số lượng còn
    }

    res.json({
      code: 200,
      message: "Đặt hàng thành công",
      data: newOrder
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Đặt hàng thất bại"
    });
  }
}