const Account = require('../../models/account.model');
const Order = require('../../models/order.model');

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
      let newOrder = {
        id: order.id,
        cart_id: order.cart_id,
        userInfo: order.userInfo,
        products: order.products,
        discountId: order.discountId,
        statusOrder: order.statusOrder,
        paymentMethod: order.paymentMethod,
        deleted: order.deleted,
        updateTime: order.updateTime,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
      if (order.updatedBy.account_id) {
        const account = await Account.findOne({
          _id: order.updatedBy.account_id
        }).select("fullName");

        newOrder.updatedBy = {
          fullName: account.fullName,
          account_id: order.updatedBy.account_id,
          updatedAt: order.updatedBy.updatedAt
        }
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