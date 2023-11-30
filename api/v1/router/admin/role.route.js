const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/role.controller');

route.get('/', controller.index);

route.post('/add', controller.add);

route.get('/detail/:id', controller.detail);

route.patch('/edit/:id', controller.edit);

route.delete('/delete/:id', controller.deleteItem);

route.patch('/permissions', controller.permissions);

module.exports = route;