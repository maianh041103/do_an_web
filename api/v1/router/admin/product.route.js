const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/product.controller');
const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.get('/', authAdminMiddlerware.authProductView, controller.index);

route.post('/add', authAdminMiddlerware.authProductView, controller.add);

route.patch('/edit/:id', authAdminMiddlerware.authProductEdit, controller.edit);

route.delete('/delete/:id', authAdminMiddlerware.authProductDelete, controller.delete);

module.exports = route;