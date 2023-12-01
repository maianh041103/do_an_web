const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/order.controller');
const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.get('/', authAdminMiddlerware.authOrderView, controller.index);

route.patch('/edit/:id', authAdminMiddlerware.authOrderEdit, controller.edit);

module.exports = route;