const Account = require('../../models/account.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const getStockProductByIdHelper = require('../../../../helper/getStockProductById');
const calcPriceNewHelper = require('../../../../helper/calcPriceNew.helper');
const getProductHelper = require('../../../../helper/getProduct.helper');

//[GET] /api/v1/cart/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({
    account_id: req.user.id
  });

  //Truyền vào product_id in ra giá mới, giá cũ, giảm giá,...
  let products = [];
  for (let i = 0; i < cart?.products?.length; i++) {
    let product = {
      product_id: cart.products[i].product_id,
      childTitle: cart.products[i].childTitle,
      quantity: cart.products[i].quantity
    }
    let productData = await Product.findOne({
      _id: cart.products[i].product_id,
      deleted: false
    });
    productData = await getProductHelper.getProduct(productData);
    let newProductData = {
      title: productData.title,
      description: productData.description,
      images: productData.images,
      price: productData.price,
      stock: productData.stock,
      quantity: productData.quantity,
      featured: productData.featured,
      status: productData.status,
      properties: productData.properties,
      deleted: productData.deleted,
      slug: productData.slug,
      rate: productData.rate,
      discountPercent: productData.discountPercent,
      //minPrice: productData.minPrice,
      //buyed: productData.buyed,
      productCategoryTitle: productData.productCategoryTitle
    }
    if (cart.products[i].childTitle !== "none") {
      let productChild = productData.newGroup.find(item => {
        return item.childTitle === cart.products[i].childTitle;
      })
      newProductData.productChild = productChild;
    }
    product.infoProduct = newProductData;
    products.push(product);
  }
  //End

  let newCart = {
    account_id: cart?.account_id,
    products: products
  }

  res.json({
    cart: newCart
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

//[PATCH] /api/v1/cart/delete
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

