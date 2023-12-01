const Order = require('../../models/order.model');

//[GET] /admin/orders/
module.exports.index = async (req, res) => {
  try {
    const listOrder = await Order.find({
      deleted: false
    }).sort({
      createdAt: "desc"
    });
    res.json({
      listOrder: listOrder
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
    await Order.updateOne({
      _id: req.params.id
    }, data);
    const newOrder = await Order.findOne({
      _id: req.params.id
    });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái giao hàng thành công",
      order: newOrder
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật trạng thái đơn hàng thất bại"
    });
  }
}