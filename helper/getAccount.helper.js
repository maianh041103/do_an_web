const Role = require('../api/v1/models/role.model');
const Account = require('../api/v1/models/account.model');

module.exports.getAccount = async (account) => {
  let newAccount = {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    password: account.password,
    token: account.token,
    phone: account.phone,
    avatar: account.avatar,
    status: account.status,
    address: account.address,
    role_id: account.role_id
  }
  if (account.rank === 0) {
    newAccount.rank = "đồng";
  } else if (account.rank === 1) {
    newAccount.rank = 'bạc';
  } else if (account.rank === 2) {
    newAccount.rank = 'vàng';
  } else {
    newAccount.rank = 'kim cương';
  }

  const role = await Role.findOne({
    _id: account.role_id,
    deleted: false
  }).select("title permissions");

  if (role) {
    newAccount.role = role;
  }
  if (account.updatedBy.account_id) {
    const accountUpdated = await Account.findOne({
      _id: account.updatedBy.account_id
    });
    if (accountUpdated) {
      newAccount.updatedBy = {
        account_id: account.updatedBy.account_id,
        fullName: accountUpdated.fullName,
        updatedAt: account.updatedBy.updatedAt
      }
    }
  }
  return newAccount;
}