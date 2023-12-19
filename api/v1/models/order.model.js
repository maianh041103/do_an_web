const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  cart_id: String,
  userInfo: {
    fullName: String,
    phone: String,
    address: String
  },
  products: [
    {
      product_id: String,
      childTitle: String,
      quantity: Number,
      price: Number,
      discountPercent: Number,
      statusComment: {
        type: Number,
        default: 0
      }
      // 1 : được đánh giá (giao hàng thành công mới bật lên 1)
      // 0 : không được đánh giá
    }
  ],
  discountId: String,
  statusOrder: {
    type: Number,
    default: 0
  },
  paymentMethod: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  updatedBy: {
    account_id: String,
    updatedAt: Date
  },
  updateTime: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
})

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;

// Admin có thể sửa được trạng thái đơn hàng
// Khi sửa thì nó sẽ lấy thời gian lúc sửa + trạng thái * 2
// Chờ thanh toán : 0
// Vận chuyển : 1
// Chờ giao hàng : 2
// Hoàn thành : 3
// Đã hủy : 4
