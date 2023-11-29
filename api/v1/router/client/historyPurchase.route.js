const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/historyPurchase.controller');

route.get('/', controller.view);

route.get('/detail/:id', controller.detail);

route.patch('/cancel/:orderId', controller.cancel);

module.exports = route;