const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/category.controller');

route.get('/', controller.index);

route.post('/add', controller.add);

route.patch('/edit/:id', controller.edit);

route.delete('/delete/:id', controller.deleteItem);

module.exports = route;