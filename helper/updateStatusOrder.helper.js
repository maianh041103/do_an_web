const dateDiffHelper = require('./datediff.helper');
const Order = require('../api/v1/models/order.model');
const FeedBack = require('../api/v1/models/feedback.model');

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
        }
      }
    }
  }
}