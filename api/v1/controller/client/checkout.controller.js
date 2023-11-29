const Product = require('../../models/product.model');
const Discount = require('../../models/discount.model');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');

const getStockProductByIdHelper = require('../../../../helper/getStockProductById');

//[GET] /api/v1/checkout
module.exports.checkout = async (req, res) => {
  //Lấy ra sản phẩm 
  // const listProductId = req.body.products;

  // for (let i = 0; i < listProductId.length; i++) {
  //   const productData = await Product.findOne({
  //     _id: listProductId[i].product_id,
  //     deleted: false
  //   });
  //   if (listProductId[i].childTitle === "none") {
  //     listProductId[i].infoProduct = productData;
  //   } else {
  //     const productChild = productData.group.find(item => {
  //       return item.childTitle === listProductId[i].childTitle;
  //     })
  //     const data = await Product.findOne({
  //       _id: listProductId[i].product_id,
  //       deleted: false
  //     }).select("-group");
  //     data.productChild = productChild;
  //     listProductId[i].infoProduct = data;
  //   }
  // }

  // for (let i = 0; i < listProductId.length; i++) {
  //   console.log(listProductId[i].infoProduct);
  //   console.log(listProductId[i].infoProduct.productChild);
  // }

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
    specialDay: specialDay
  });
  //End lấy ra mã giảm giá

  res.json({
    // listProductId: listProductId,
    listDiscount: listDiscount,
    user: req.user
    //Gửi thông tin user để điền trước lên form (user có thể sửa thông tin giao hàng hoặc không)
  });
}

//[POST] /api/v1/checkout/success
module.exports.order = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      account_id: req.user.id
    });

    const products = req.body.products;
    for (let i = 0; i < products.length; i++) {
      const productData = await Product.findOne({
        _id: products[i].product_id,
        deleted: false
      });
      if (products[i].childTitle === "none") {
        products[i].price = productData.price;
      } else {
        const productChild = productData.group.find(item => {
          return item.childTitle === products[i].childTitle;
        })
        products[i].price = productChild.price;
      }
    }

    const data = {
      cart_id: cart.id,
      userInfo: {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
      },
      products: products,
      discountId: req.body.discountId,
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
      message: "Đặt hàng thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Đặt hàng thất bại"
    });
  }

}