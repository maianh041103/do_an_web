const updateStatusOrderHelper = require('../../../helper/updateStatusOrder.helper');

module.exports.updateOrderStatus = async (req, res, next) => {
  updateStatusOrderHelper.update();
  next();
}