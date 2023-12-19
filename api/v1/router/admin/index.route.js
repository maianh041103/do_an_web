const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const roleRoute = require('./role.route');
const accountRoute = require('./account.route');
const orderRoute = require('./order.route');
const settingRoute = require('./setting.route');

const systemConfig = require('../../../../config/system');
const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');
const authMiddlerware = require('../../middlerwares/auth.middlerware');
const updateStatusOrderMiddlerware = require('../../middlerwares/updateOrderStatus.middlerware');

module.exports = (app) => {
  const version = '/api/v1';
  const PATH_ADMIN = systemConfig.prefixAdmin;
  //app.use(authMiddlerware.authMiddler);
  //app.use(authAdminMiddlerware.authAdmin);
  app.use(updateStatusOrderMiddlerware.updateOrderStatus);
  app.use(`${version}${PATH_ADMIN}/productCategory`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, categoryRoute);
  app.use(`${version}${PATH_ADMIN}/products`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, productRoute);
  app.use(`${version}${PATH_ADMIN}/roles`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, roleRoute);
  app.use(`${version}${PATH_ADMIN}/accounts`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, accountRoute);
  app.use(`${version}${PATH_ADMIN}/orders`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, orderRoute);
  app.use(`${version}${PATH_ADMIN}/settings`, authMiddlerware.authMiddler, authAdminMiddlerware.authAdmin, settingRoute);
}