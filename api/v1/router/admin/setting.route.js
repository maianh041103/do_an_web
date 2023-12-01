const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/setting.controller');

const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.patch('/edit', authAdminMiddlerware.authSettingGeneralEdit, controller.edit);

module.exports = route;