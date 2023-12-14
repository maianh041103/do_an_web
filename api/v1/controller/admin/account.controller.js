const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const getAccountHelper = require('../../../../helper/getAccount.helper');
//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const listAccount = await Account.find({
      deleted: false
    });
    let newListAccount = [];
    for (const account of listAccount) {
      let newAccount = await getAccountHelper.getAccount(account);
      newListAccount.push(newAccount);
    }
    res.json({
      listAccount: newListAccount
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
    let newAccount = await getAccountHelper.getAccount(account);
    res.json({
      account: newAccount
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
    const updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }
    req.body.updatedBy = updatedBy;
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
    const deletedBy = {
      account_id: req.user.id,
      deletedAt: new Date()
    }
    await Account.updateOne({
      _id: req.params.id
    }, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy
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