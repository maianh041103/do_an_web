const homeRoute = require('./home.route');
const productRoute = require('./products.route');
const generalRoute = require('./general.route');
const feedbackRoute = require('./feedback.route');
const accountRoute = require('./account.route');
const favoriteRoute = require('./favorite.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const historyPurchaseRoute = require('./historyPurchase.route');

const authMiddlerware = require('../../middlerwares/auth.middlerware');
const updateStatusOrderMiddlerware = require('../../middlerwares/updateOrderStatus.middlerware');

module.exports = (app) => {
  const version = '/api/v1';
  app.use(updateStatusOrderMiddlerware.updateOrderStatus);
  app.use(version + '/', homeRoute);
  app.use(version + '/products', productRoute);
  app.use(version + '/general', generalRoute);
  app.use(version + '/feedbacks', feedbackRoute);
  app.use(version + '/account', accountRoute);
  app.use(version + '/favorite', authMiddlerware.authMiddler, favoriteRoute);
  app.use(version + '/cart', authMiddlerware.authMiddler, cartRoute);
  app.use(version + '/checkout', authMiddlerware.authMiddler, checkoutRoute);
  app.use(version + '/historyPurchase', authMiddlerware.authMiddler, historyPurchaseRoute);
}
