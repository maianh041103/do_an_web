const chatAdminRoute = require('./chatAdmin.route');
const chatClientRoute = require('./chatClient.route');
const authChatMiddlerware = require('../../middlerwares/authChat.middlerware');
const systemConfig = require('../../../../config/system');

module.exports = (app) => {
  const version = '/api/v1';
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(`${version}${PATH_ADMIN}/chat`, authChatMiddlerware.authChat, chatAdminRoute);

  app.use(`${version}/chat`, authChatMiddlerware.authChat, chatClientRoute);
}