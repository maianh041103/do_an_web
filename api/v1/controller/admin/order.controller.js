const Account = require('../../models/account.model');
const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const FeedBack = require('../../models/feedback.model');
const Discount = require('../../models/discount.model');

const calcTotalPriceOrderHelper = require('../../../../helper/calcTotalPriceOrder.helper');
const getListProductHelper = require('../../../../helper/getListProduct.helper');

//[GET] /admin/orders/
module.exports.index = async (req, res) => {
  try {
    const listOrder = await Order.find({
      deleted: false
    }).sort({
      createdAt: "desc"
    });
    let newListOrder = [];
    for (const order of listOrder) {
      let products = await getListProductHelper.getListProductsCart(order.products);
      let newOrder = {
        id: order.id,
        cart_id: order.cart_id,
        userInfo: order.userInfo,
        products: products,
        discountId: order.discountId,
        statusOrder: order.statusOrder,
        paymentMethod: order.paymentMethod,
        deleted: order.deleted,
        updateTime: order.updateTime,
        createdAt: order.createdAt
      }
      newListOrder.push(newOrder);
    }
    res.json({
      listOrder: newListOrder
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm được danh sách đơn đặt hàng"
    });
  }
}

//[PATCH] /admin/orders/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const data = req.body;
    data.updateTime = new Date();
    data.updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }
    await Order.updateOne({
      _id: req.params.id
    }, data);

    const order = await Order.findOne({
      _id: req.params.id
    });

    if (order.statusOrder === 3) {
      for (const product of order.products) {
        const check = await FeedBack.findOne({
          orderId: order.id,
          productId: product.product_id
        });
        if (!check) {
          await Order.updateOne({
            _id: order.id,
            "products.product_id": product.product_id
          }, {
            $set: {
              "products.$.statusComment": 1
            }
          });
        }
        else {
          await Order.updateOne({
            _id: order.id,
            "products.product_id": product.product_id
          }, {
            $set: {
              "products.$.statusComment": 0
            }
          });
        }
      }
      //Cập nhật rank
      const cart = await Cart.findOne({
        _id: order.cart_id,
        deleted: false
      });

      if (cart) {
        let totalPrice = 0;
        const listOrder = await Order.find({
          cart_id: cart.id,
          deleted: false
        });
        for (let order of listOrder) {
          totalPrice += calcTotalPriceOrderHelper.calc(order);
          const discount = await Discount.findOne({
            _id: order.discountId,
            deleted: false
          });
          if (discount) {
            totalPrice = parseFloat((totalPrice * (100 - discount.discountPercent) / 100).toFixed(0));
          }
        }
        let rank = 0;
        if (totalPrice >= 1000 && totalPrice < 2000) {
          rank = 1;
        } else if (totalPrice < 4000) {
          rank = 2;
        } else {
          rank = 3;
        }
        await Account.updateOne({
          _id: cart.account_id,
          deleted: false
        }, {
          rank: rank
        });
      }
      //End cập nhật rank
    }

    const result = await Order.findOne({
      _id: req.params.id
    });

    res.json({
      code: 200,
      message: "Cập nhật trạng thái giao hàng thành công",
      order: result
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật trạng thái đơn hàng thất bại"
    });
  }
}