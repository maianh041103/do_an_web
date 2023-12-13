const Role = require('../../models/role.model');
const Account = require('../../models/account.model');
const compareArrayHelper = require('../../../../helper/compareArray.helper');

//[GET] /admin/roles/
module.exports.index = async (req, res) => {
  try {
    const roles = await Role.find({
      deleted: false
    });
    let newRoles = [];
    for (let role of roles) {
      let newRole = {
        id: role.id,
        title: role.title,
        description: role.description,
        permissions: role.permissions,
        deleted: role.deleted,
        deletedBy: role.deletedBy,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }
      if (role.createdBy.account_id) {
        const account = await Account.findOne({
          _id: role.createdBy.account_id,
          deleted: false
        }).select("fullName");
        if (account) {
          newRole.createdBy = {
            account_id: role.createdBy.account_id,
            fullName: account.fullName,
            createdAt: new Date()
          }
        }
      }

      if (role.updatedBy.account_id) {
        const account = await Account.findOne({
          _id: role.updatedBy.account_id,
          deleted: false
        }).select("fullName");
        if (account) {
          newRole.updatedBy = {
            account_id: role.updatedBy.account_id,
            fullName: account.fullName,
            updatedAt: new Date()
          }
        }
      }

      newRoles.push(newRole);
    }
    res.json({
      roles: newRoles
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Không lấy được danh sách nhóm quyền"
    });
  }
}

//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: req.params.id
    });
    res.json({
      role: role
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm được nhóm quyền muốn xem"
    });
  }
}

//[POST] /admin/roles/add
module.exports.add = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: req.user.id,
      createdAt: new Date()
    }
    const newRole = new Role(req.body);
    await newRole.save();
    res.json({
      code: 200,
      message: "Thêm mới nhóm quyền thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Thêm mới nhóm quyền thất bại"
    });
  }
}

//[PATCH] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    req.body.updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }

    await Role.updateOne({
      _id: req.params.id
    }, req.body);

    const newRole = await Role.findOne({
      _id: req.params.id
    });
    res.json({
      code: 200,
      role: newRole,
      message: "Sửa thông tin nhóm quyền thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Sửa thông tin nhóm quyền thất bại"
    });
  }
}

//[DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await Role.updateOne({
      _id: req.params.id
    }, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: {
        account_id: req.user.id,
        deletedAt: new Date(),
        deletedBy: {
          account_id: req.user.id,
          deletedAt: new Date()
        }
      }
    });
    res.json({
      code: 200,
      message: "Xóa nhóm quyền thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa nhóm quyền thất bại"
    });
  }
}

//[PATCH] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  try {
    const updatedBy = {
      account_id: req.user.id,
      updatedAt: new Date()
    }

    const rolePermission = req.body;
    for (const item of rolePermission) {
      const permissionCurrent = await Role.findOne({ _id: item.role_id }).select("permissions");
      if (!compareArrayHelper.compare(permissionCurrent.permissions, item.permissions)) {
        await Role.updateOne({ _id: item.role_id }, { permissions: item.permissions, updatedBy: updatedBy });
      }
    }

    res.json({
      code: 200,
      message: "Cập nhật phân quyền thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Cập nhật phân quyền thất bại"
    });
  }
}


