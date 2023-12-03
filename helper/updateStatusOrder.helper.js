const dateDiffHelper = require('./datediff.helper');
const calcTotalPriceOrderHelper = require('./calcTotalPriceOrder.helper');


const Order = require('../api/v1/models/order.model');
const FeedBack = require('../api/v1/models/feedback.model');
const Cart = require('../api/v1/models/cart.model');
const Account = require('../api/v1/models/account.model');
const Discount = require('../api/v1/models/discount.model');

module.exports.update = async () => {
  const orders = await Order.find({
    deleted: false
  });
  for (const order of orders) {
    if (order.statusOrder < 3) {
      const time = dateDiffHelper.diff(order.updateTime, Date.now());
      const count = Math.floor(time / 2);
      if (count >= 1) {
        const statusOrder = Math.min((order.statusOrder + count), 3);
        let updateTime = order.updateTime;
        updateTime = updateTime.setDate(updateTime.getDate() + count * 2);
        const updateTimeConvert = (new Date(updateTime)).toISOString();
        await Order.updateOne({
          _id: order.id
        }, {
          statusOrder: statusOrder,
          updateTime: updateTimeConvert
        })

        //Cập nhật statusOrder
        if (statusOrder === 3) {
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
      }
    }
  }
}