const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/product.controller');

route.get('/', controller.index);

route.post('/add', controller.add);

route.patch('/edit/:id', controller.edit);

route.delete('/delete/:id', controller.delete);

module.exports = route;