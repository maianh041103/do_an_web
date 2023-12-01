const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/account.controller');

const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.get('/', authAdminMiddlerware.authAccountView, controller.index);

route.get('/detail/:id', authAdminMiddlerware.authAccountView, controller.detail);

route.patch('/edit/:id', authAdminMiddlerware.authAccountEdit, controller.edit);

route.delete('/delete/:id', authAdminMiddlerware.authAccountDelete, controller.delete);

module.exports = route;