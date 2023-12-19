const Account = require('../models/account.model');
const Role = require('../models/role.model');


module.exports.authChat = async (req, res, next) => {
  if (req.query.token) {
    const token = req.query.token;

    let account = await Account.findOne({
      token: token,
      deleted: false,
      status: "active"
    });

    if (account) {
      req.user = account;
      const roleUser = await Role.findOne({
        _id: account.role_id
      });

      if (roleUser.permissions.includes("chat") || roleUser.id === '6568a9f308e5088688d1c345') {
        next();
      } else {
        res.json({
          code: 400,
          message: "Bạn không có quyền truy cập trang chat này "
        });
      }
    }
    else {
      res.json({
        code: 400,
        message: "Bạn không có quyền truy cập trang chat này "
      });
    }
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập trang chat này "
    });
  }
}