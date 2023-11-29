const Account = require('../models/account.model');

module.exports.authRegister = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    });
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu"
    })
    return;
  }
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: "Vui lòng nhập họ tên"
    })
    return;
  }

  const emailExists = await Account.findOne({
    email: req.body.email
  })

  if (emailExists) {
    res.json({
      code: 400,
      message: "Email đã tồn tại"
    });
    return;
  }

  next();
}

module.exports.authLogin = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    });
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu"
    })
    return;
  }
  next();
}

module.exports.forgotPassword = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    });
    return;
  }
  next();
}