const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const roleRoute = require('./role.route');
const accountRoute = require('./account.route');
const orderRoute = require('./order.route');

const systemConfig = require('../../../../config/system');
const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');
const authMiddlerware = require('../../middlerwares/auth.middlerware');
const updateStatusOrderMiddlerware = require('../../middlerwares/updateOrderStatus.middlerware');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(authMiddlerware.authMiddler);
  app.use(authAdminMiddlerware.authAdmin);
  app.use(updateStatusOrderMiddlerware.updateOrderStatus);
  app.use(`${PATH_ADMIN}/productCategory`, categoryRoute);
  app.use(`${PATH_ADMIN}/products`, productRoute);
  app.use(`${PATH_ADMIN}/roles`, roleRoute);
  app.use(`${PATH_ADMIN}/accounts`, accountRoute);
  app.use(`${PATH_ADMIN}/orders`, orderRoute);
}