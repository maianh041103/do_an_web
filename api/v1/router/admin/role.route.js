const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/role.controller');

const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.get('/', authAdminMiddlerware.authRoleView, controller.index);

route.post('/add', authAdminMiddlerware.authAccountCreate, controller.add);

route.get('/detail/:id', controller.detail);

route.patch('/edit/:id', authAdminMiddlerware.authAccountEdit, controller.edit);

route.delete('/delete/:id', authAdminMiddlerware.authRoleDelete, controller.deleteItem);

route.patch('/permissions', authAdminMiddlerware.authRolePermissions, controller.permissions);

module.exports = route;