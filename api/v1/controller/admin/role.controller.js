const Role = require('../../models/role.model');

//[GET] /admin/roles/
module.exports.index = async (req, res) => {
  try {
    const roles = await Role.find({
      deleted: false
    });
    res.json({
      roles: roles
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không lấy được danh sách nhóm quyền"
    });
  }
}

//[POST] /admin/roles/add
module.exports.add = async (req, res) => {
  try {
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

//[PATCH] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    await Role.updateOne({
      _id: req.params.id
    }, req.body);
    const newRole = await Role.findOne({
      _id: req.params.id
    });
    res.json({
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
      deletedAt: new Date()
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
    const rolePermission = req.body;
    for (const item of rolePermission) {
      await Role.updateOne({
        _id: item.role_id
      }, {
        permissions: item.permission
      });
    }
    res.json({
      code: 200,
      message: "Cập nhật phân quyền thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật phân quyền thất bại"
    });
  }
}


