const Account = require('../../models/account.model');
const Role = require('../../models/role.model.js');
const ForgotPassword = require('../../models/forgotPassword.model.js');
const generateHelper = require('../../../../helper/generate.helper');
const sendEmailHelper = require('../../../../helper/sendEmail.helper');
const getAccoutHelper = require('../../../../helper/getAccount.helper.js');

const md5 = require('md5');

//[POST] /api/v1/account/register
module.exports.register = async (req, res) => {
  try {
    const data = req.body;
    data.password = md5(data.password);
    data.token = generateHelper.generateRandomString(20);
    const newAccount = new Account(data);
    await newAccount.save();
    res.cookie("token", data.token);
    res.json({
      code: 200,
      message: "Thêm tài khoản thành công",
      token: data.token
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Thêm tài khoản thất bại"
    })
  }
}

//[POST] /api/v1/account/login
module.exports.login = async (req, res) => {
  let user = await Account.findOne({
    email: req.body.email
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại"
    });
    return;
  }

  if (user.password !== md5(req.body.password)) {
    res.json({
      code: 400,
      message: "Mật khẩu không tồn tại"
    })
    return;
  }

  user = await getAccoutHelper.getAccount(user);

  res.cookie("token", user.token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    user: user,
    token: user.token
  });
}

//[POST] /api/v1/account/forgot/email
module.exports.email = async (req, res) => {
  const email = req.body.email;
  const user = await Account.findOne({
    email: email
  });

  if (user) {
    const otp = generateHelper.generateRandomNumber(6);
    const dataForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + 300000
    }

    const data = new ForgotPassword(dataForgotPassword);
    await data.save();

    const emailTo = "nguyenmaianh041103@gmail.com";
    const subject = "Gửi mã OTP lấy lại mật khẩu";
    const html = `Mã OTP là : ${otp}`
    sendEmailHelper.sendEmail(emailTo, email, subject, html);

    res.json({
      code: 200,
      message: "Email hợp lệ"
    });
  }
  else {
    res.json({
      code: 400,
      message: "Email không tồn tại"
    })
  }
}

//[POST] /api/v1/account/forgot/otp
module.exports.otp = async (req, res) => {
  const otpExists = await ForgotPassword.findOne({
    email: req.body.email,
    otp: req.body.otp
  })
  if (otpExists) {
    const user = await Account.findOne({
      email: req.body.email
    });
    res.cookie("token", user.token);

    res.json({
      code: 200,
      message: "Mã OTP chính xác"
    });
  }
  else {
    res.json({
      code: 400,
      message: "Mã OTP không chính xác"
    });
  }
}

//[PATCH] /api/v1/account/forgot/reset
module.exports.reset = async (req, res) => {
  console.log("OK");
  const password = req.body.password;
  const email = req.body.email;

  const user = await Account.findOne({
    email: email
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Tài khoản không tồn tại"
    });
    return;
  }

  if (user.password === md5(password)) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
    });
    return;
  }

  await Account.updateOne({
    email: email
  }, {
    password: md5(password)
  });

  res.json({
    code: 200,
    message: "Thay đổi mật khẩu thành công"
  })

}

//[PATCH] /api/v1/account/detail
module.exports.detail = async (req, res) => {
  try {
    const role = await Role.findOne({
      deleted: false,
      _id: req.user.role_id
    }).select("title permissions");
    if (role) {
      req.user.role = role;
    }
    console.log(req.user.role);
    res.json({
      userInfo: req.user
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy người dùng"
    })
  }
}

//[PATCH] /api/v1/account/uploadImage
module.exports.uploadImage = async (req, res) => {
  try {
    res.json({
      code: 200,
      message: "Upload ảnh thành công",
      avatar: req.body.avatar
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Upload ảnh thất bại"
    });
  }
}

//[PATCH] /api/v1/account/edit
module.exports.edit = async (req, res) => {
  try {
    const accountUpdate = await Account.findOne({
      token: req.user.token
    });

    const email = req.body.email;
    const emailExists = await Account.findOne({
      _id: { $ne: accountUpdate.id },
      email: email
    });

    if (emailExists) {
      res.json({
        code: 400,
        message: "Email đã tồn tại"
      })
    }
    else {
      await Account.updateOne({ token: req.user.token }, req.body);
      const newData = await Account.findOne({
        token: req.user.token
      });
      res.json({
        code: 200,
        message: "Cập nhật thông tin tài khoản thành công",
        user: newData
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thông tin tài khoản thất bại"
    })
  }
}

//[POST] /api/v1/account/change-password/old-password
module.exports.oldPassword = async (req, res) => {
  try {
    const oldPassword = req.body.password;
    if (md5(oldPassword) === req.user.password) {
      res.json({
        code: 200,
        message: "Nhập mật khẩu chính xác"
      });
    } else {
      res.json({
        code: 400,
        message: "Nhập mật khẩu sai"
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Nhập mật khẩu sai"
    })
  }
}

//[PATCH] /api/v1/change-password/reset
module.exports.resetChangePasword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    await Account.updateOne({
      token: req.user.token
    }, {
      password: md5(newPassword)
    });
    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Đổi mật khẩu thất bại"
    });
  }

}

//[GET] /api/v1/logout
module.exports.logout = async (req, res) => {
  try {
    delete req.user;
    res.json({
      code: 200,
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng xuất thất bại"
    });
  }
}