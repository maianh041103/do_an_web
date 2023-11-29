const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const updateStatusOrderHelper = require('../../../../helper/updateStatusOrder');
const getStockProductByIdHelper = require('../../../../helper/getStockProductById');

//[GET] /api/v1/historyPurchase
module.exports.view = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      account_id: req.user.id
    });

    const listOrder = await Order.find({
      cart_id: cart.id,
      deleted: false
    });

    res.json({
      historyPurchase: listOrder
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy tài khoản khách hàng"
    })
  }
}

//[GET] /api/v1/historyPurchase/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const orderDetail = await Order.find({
      _id: id
    });
    res.json({
      orderDetail: orderDetail
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Mã đơn hàng không hợp lệ"
    })
  }
}

//[PATCH] /api/v1/historyPurchase/cancel/:orderId
module.exports.cancel = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    //Cập nhật trạng thái giao hàng
    await updateStatusOrderHelper.update(orderId);
    //End cập nhật trạng thái giao hàng

    const order = await Order.findOne({
      _id: orderId,
      statusOrder: { $lt: 4 }
    });

    if (order.statusOrder <= 1) {
      //Update trạng thái sang hủy
      await Order.updateOne({
        _id: orderId
      }, {
        statusOrder: 4
      });
      //End update trạng thái sang hủy

      //Cập nhật số lượng còn lại
      for (const product of order.products) {
        const stock = await getStockProductByIdHelper.getStockById(product.product_id, product.childTitle);
        const newStock = stock + product.quantity;
        await Product.updateOne({
          _id: product.product_id,
          "group.childTitle": product.childTitle
        }, {
          $set: {
            "group.$.stock": newStock
          }
        });
      }
      //End cập nhật số lượng còn

      res.json({
        code: 200,
        message: "Hủy đơn hàng thành công",
      });
    } else {
      res.json({
        code: 400,
        message: "Đơn hàng đang trên đường vận chuyển, vui lòng không hủy đơn"
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không thể tìm thấy đơn hàng"
    })
  }

}
