const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/category.controller');

const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

route.get('/', authAdminMiddlerware.authProductCategoryView, controller.index);

route.get('/detail/:id', authAdminMiddlerware.authProductCategoryView, controller.detail);

route.post('/add', authAdminMiddlerware.authProductCategoryCreate, controller.add);

route.patch('/edit/:id', authAdminMiddlerware.authProductCategoryEdit, controller.edit);

route.delete('/delete/:id', authAdminMiddlerware.authProductCategoryDelete, controller.deleteItem);

module.exports = route;