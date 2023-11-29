const FavoriteProduct = require("../../models/favoriteProduct.model");
const Product = require("../../models/product.model");

//[GET] /api/v1/favorite
module.exports.index = async (req, res) => {
  const listProductsFavorite = await FavoriteProduct.find({
    accountId: req.user.id
  });
  res.json({
    code: 200,
    listProductsFavorite: listProductsFavorite
  });
}

//[GET] /api/v1/favorite/add/:id
module.exports.addFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
      deleted: false,
      status: "active"
    })

    const user = req.user;

    const favoriteProduct = await FavoriteProduct.findOne({
      accountId: user.id
    });

    const productExist = await FavoriteProduct.findOne({
      accountId: user.id,
      productId: product.id
    });

    if (productExist) {
      res.json({
        code: 200,
        message: "Sản phẩm đã có trong danh sách yêu thích"
      })
      return;
    }

    if (favoriteProduct) {
      await FavoriteProduct.updateOne({ accountId: user.id }, {
        $push: { productId: product.id }
      });
    }
    else {
      const data = {
        accountId: user.id,
        productId: product.id
      };
      const newItem = new FavoriteProduct(data);
      await newItem.save();
    }
    res.json({
      code: 200,
      message: "Thêm sản phẩm yêu thích thành công"
    })

  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy sản phẩm muốn thêm"
    })
  }
}

//[DELETE] /api/v1/favorite/delete/:id
module.exports.deleteFavourite = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;

    const productExist = await FavoriteProduct.findOne({
      accountId: user.id,
      productId: productId
    });

    if (productExist) {
      await FavoriteProduct.updateOne({
        accountId: user.id,
        productId: productId
      }, {
        $pull: { productId: productId }
      })
      res.json({
        code: 200,
        message: "Xóa sản phẩm thành công"
      })
      return;
    } else {
      res.json({
        code: 400,
        message: "Không tìm thấy sản phẩm muốn xóa!"
      })
      return;
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy sản phẩm muốn xóa"
    })
  }
}