const Account = require('../models/account.model');
const Role = require('../models/role.model');

module.exports.authAdmin = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await Account.findOne({
      token: token,
      deleted: false,
      status: "active"
    });
    if (user) {
      const roleUser = await Role.findOne({
        _id: user.role_id
      });
      req.user.title = roleUser.title;
      req.user.permissions = roleUser.permissions;
      next();
    }
    else {
      res.json({
        code: 400,
        message: "Bạn không có quyền truy cập trang này "
      });
    }
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập trang này "
    });
  }
}

module.exports.authProductCategoryView = async (req, res, next) => {
  if (req.user.permissions.includes("products-category_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductCategoryCreate = async (req, res, next) => {
  if (req.user.permissions.includes("products-category_create")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductCategoryEdit = async (req, res, next) => {
  if (req.user.permissions.includes("products-category_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductCategoryDelete = async (req, res, next) => {
  if (req.user.permissions.includes("products-category_delete")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductView = async (req, res, next) => {
  if (req.user.permissions.includes("products_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductCreate = async (req, res, next) => {
  if (req.user.permissions.includes("products_create")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductEdit = async (req, res, next) => {
  if (req.user.permissions.includes("products_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authProductDelete = async (req, res, next) => {
  if (req.user.permissions.includes("products_delete")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authRoleView = async (req, res, next) => {
  if (req.user.permissions.includes("roles_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authRoleCreate = async (req, res, next) => {
  if (req.user.permissions.includes("roles_create")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authRoleEdit = async (req, res, next) => {
  if (req.user.permissions.includes("roles_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authRoleDelete = async (req, res, next) => {
  if (req.user.permissions.includes("roles_delete")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authRolePermissions = async (req, res, next) => {
  if (req.user.permissions.includes("roles_permissions")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authAccountView = async (req, res, next) => {
  if (req.user.permissions.includes("account_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authAccountCreate = async (req, res, next) => {
  if (req.user.permissions.includes("account_create")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authAccountEdit = async (req, res, next) => {
  if (req.user.permissions.includes("account_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authAccountDelete = async (req, res, next) => {
  if (req.user.permissions.includes("account_delete")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authOrderView = async (req, res, next) => {
  if (req.user.permissions.includes("order_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authOrderEdit = async (req, res, next) => {
  if (req.user.permissions.includes("order_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authCommentDelete = async (req, res, next) => {
  if (req.user.permissions.includes("comment-delete")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authSettingGeneralView = async (req, res, next) => {
  if (req.user.permissions.includes("setting-general_view")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authSettingGeneralEdit = async (req, res, next) => {
  if (req.user.permissions.includes("setting-general_edit")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}

module.exports.authChat = async (req, res, next) => {
  if (req.user.permissions.includes("chat")) {
    next();
  } else {
    res.json({
      code: 400,
      message: "Bạn không có quyền truy cập vào trang web này"
    });
  }
}
