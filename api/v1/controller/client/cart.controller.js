const Account = require('../../models/account.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const getStockProductByIdHelper = require('../../../../helper/getStockProductById');

//[GET] /api/v1/cart/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({
    account_id: req.user.id
  });

  for (let i = 0; i < cart.products.length; i++) {
    const productData = await Product.findOne({
      _id: cart.products[i].product_id,
      deleted: false
    });
    if (cart.products[i].childTitle === "none") {
      cart.products[i].infoProduct = productData;
    } else {
      const productChild = productData.group.find(item => {
        return item.childTitle === cart.products[i].childTitle;
      })
      const data = await Product.findOne({
        _id: cart.products[i].product_id,
        deleted: false
      }).select("-group");
      data.productChild = productChild;
      cart.products[i].infoProduct = data;
    }
  }

  // for (let i = 0; i < cart.products.length; i++) {
  //   console.log(cart.products[i].infoProduct.productChild);
  // }

  res.json({
    cart: cart
  })
}

//[POST] /api/v1/cart/add
module.exports.addProduct = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      account_id: req.user.id
    });
    const productId = req.body.id;
    const childTitle = req.body.childTitle;
    const quantity = req.body.quantity;

    //Xử lý phần số lượng thêm vào giỏ hàng 
    const stock = await getStockProductByIdHelper.getStockById(productId, childTitle)
    if (quantity > stock) {
      res.json({
        code: 400,
        message: "Sản phẩm không còn đủ số lượng"
      });
      return;
    }
    //End số lượng thêm vào giỏ hàng

    if (cart) {
      const productExists = cart.products.find((item) => {
        return productId === item.product_id && childTitle === item.childTitle;
      })

      if (!productExists) {
        //Chưa tồn tại sản phẩm trong giỏ hàng
        await Cart.updateOne({
          account_id: req.user.id
        }, {
          $push: {
            products: {
              product_id: productId,
              childTitle: childTitle,
              quantity: quantity
            }
          }
        });

      } else {
        //Đã tồn tại sản phẩm trong giỏ hàng
        const totalQuantity = parseInt(productExists.quantity) + parseInt(quantity);
        if (totalQuantity > stock) {
          res.json({
            code: 400,
            message: "Sản phẩm không còn đủ số lượng"
          });
          return;
        }

        await Cart.updateOne({
          account_id: req.user.id,
          "products.product_id": productId
        }, {
          "$set": {
            "products.$.quantity": totalQuantity
          }
        })
      }

    } else {
      //Chưa tồn tại giỏ hàng
      const data = {
        account_id: req.user.id,
        products: [
          {
            product_id: productId,
            childTitle: childTitle,
            quantity: quantity
          }
        ]
      }
      const newCart = new Cart(data);
      await newCart.save();
    }

    res.json({
      code: 200,
      message: "Thêm sản phẩm vào giỏ hàng thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Thêm sản phẩm vào giỏ hàng thất bại"
    })
  }
}

//[PATCH] /api/v1/cart/update
module.exports.update = async (req, res) => {
  try {
    const productId = req.body.id;
    const childTitle = req.body.childTitle;
    const quantity = req.body.quantity;

    const stock = await getStockProductByIdHelper.getStockById(productId, childTitle);
    console.log(stock);

    if (stock < quantity) {
      res.json({
        code: 400,
        message: "Số lượng sản phẩm không đủ"
      });
      return;
    }

    await Cart.updateOne({
      account_id: req.user.id,
      "products.product_id": productId
    }, {
      "$set": {
        "products.$.quantity": quantity
      }
    })

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật số lượng thất bại"
    })
  }
}

//[DELETE] /api/v1/cart/delete
module.exports.delete = async (req, res) => {
  try {
    const productId = req.body.id;
    const childTitle = req.body.childTitle;
    await Cart.updateOne({
      account_id: req.user.id
    }, {
      $pull: {
        products: {
          product_id: productId,
          childTitle: childTitle
        }
      }
    });

    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa sản phẩm thất bại"
    })
  }

}

