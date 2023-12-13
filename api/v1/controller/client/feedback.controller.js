const FeedBack = require('../../models/feedback.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');

const productBestSeller = require('../../../../helper/productBestSeller.helper');

module.exports.create = async (req, res) => {
  try {
    let statusFeedBack = 0; //Không được đánh giá
    const order = await Order.findOne({
      _id: req.body.orderId
    });
    if (order) {
      statusFeedBack = order.products.find((item) => {
        return item.product_id === req.body.productId
      }).statusComment;
    }
    if (statusFeedBack === 1) {
      const feedback = new FeedBack(req.body);
      await feedback.save();

      //Cập nhật lại trạng thái đánh giá
      if (req.body.childTitle !== "none") {
        await Order.updateOne({
          _id: req.body.orderId,
          "products.product_id": req.body.productId,
          "products.childTitle": req.body.childTitle
        }, {
          $set: {
            "products.$.statusComment": 0
          }
        });
      }
      else {
        await Order.updateOne({
          _id: req.body.orderId,
          "products.product_id": req.body.productId
        }, {
          $set: {
            "products.$.statusComment": 0
          }
        });
      }
      //End cập nhật trạng thái đánh giá 

      //Cập nhật rate sản phẩm
      const product = await Product.findOne({
        _id: req.body.productId
      });
      const totalProductSold = productBestSeller.productSold(product);
      const rate = ((product.rate * totalProductSold + req.body.rate) / (totalProductSold + 1)).toFixed(2);
      await Product.updateOne({
        _id: req.body.productId
      }, {
        rate: rate
      });
      //End cập nhật rate sản phẩm

      res.json({
        code: 200,
        message: "Đánh giá thành công"
      })
    }
    else {
      res.json({
        code: 400,
        message: "Bạn không thể đánh giá sản phẩm này"
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Đánh giá sản phẩm thất bại"
    })
  }


}