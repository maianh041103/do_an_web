const dateDiffHelper = require('./datediff.helper');
const Order = require('../api/v1/models/order.model');

module.exports.update = async (orderId) => {
  const order = await Order.findOne({
    _id: orderId
  });
  if (order.statusOrder < 4) {
    const time = dateDiffHelper.diff(order.updateTime, Date.now());
    const count = Math.floor(time / 2);
    if (count >= 1) {
      const statusOrder = order.statusOrder + count;
      let updateTime = order.updateTime;
      updateTime = updateTime.setDate(updateTime.getDate() + count * 2);
      const updateTimeConvert = (new Date(updateTime)).toISOString();
      await Order.updateOne({
        _id: orderId
      }, {
        statusOrder: statusOrder,
        updateTime: updateTimeConvert
      })
    }
  }
}