const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const listAccount = await Account.find({
      deleted: false
    });
    for (const account of listAccount) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false
      }).select("title permissions");
      if (role) {
        account.role = role;
      }
    }
    res.json({
      listAccount: listAccount
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không tìm thấy danh sách tài khoản"
    });
  }
}

//[GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id
    });
    const role = await Role.findOne({
      _id: account.role_id
    }).select("title permissions");
    account.role = role;
    res.json({
      account: account
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy tài khoản thỏa mãn"
    });
  }
}

//[PATCH] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    await Account.updateOne({
      _id: req.params.id
    }, req.body);
    const account = await Account.findOne({
      _id: req.params.id
    });
    res.json({
      code: 200,
      message: "Cập nhật thông tin tài khoản thành công",
      account: account
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật thông tin tài khoản thất bại"
    });
  }
}

//[DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await Account.updateOne({
      _id: req.params.id
    }, {
      deleted: true,
      deletedAt: new Date()
    });
    res.json({
      code: 200,
      message: "Xóa tài khoản thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa thài khoản thất bại"
    });
  }
}