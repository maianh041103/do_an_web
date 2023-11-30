const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const roleRoute = require('./role.route');

const systemConfig = require('../../../../config/system');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(`${PATH_ADMIN}/productCategory`, categoryRoute);
  app.use(`${PATH_ADMIN}/products`, productRoute);
  app.use(`${PATH_ADMIN}/roles`, roleRoute);
}