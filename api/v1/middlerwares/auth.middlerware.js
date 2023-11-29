const Account = require('../models/account.model');

module.exports.authMiddler = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await Account.findOne({
      token: token
    });
    if (!user) {
      res.json({
        code: 403,
        message: "Bạn không có quyền vào trang này"
      })
      return;
    } else {
      req.user = user;
      next();
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền vào trang này"
    });
    return;
  }
}