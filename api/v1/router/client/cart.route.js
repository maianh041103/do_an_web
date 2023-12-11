const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/cart.controller');

route.get('/', controller.index);

route.post('/add', controller.addProduct);

route.patch('/update', controller.update);

route.patch('/delete', controller.delete);

module.exports = route;
