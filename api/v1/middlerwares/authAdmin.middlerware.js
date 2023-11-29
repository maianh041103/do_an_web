const Account = require('../models/account.model');
const Role = require('../models');

module.exports.authAdminMiddlerware = async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await Account.findOne({
      token: token,
      deleted: false,
      status: "active"
    });
    if (user) {
      const roleUser = await
    }
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập trang này nhé, xin chào và hẹn gặp lại"
    });
  }
}