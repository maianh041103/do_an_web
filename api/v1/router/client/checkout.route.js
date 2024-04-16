const express = require('express');
const controller = require('../../controller/client/checkout.controller');

const route = express.Router();

route.post('/', controller.checkout);

route.get("/discount", controller.getDiscount);

route.post('/success', controller.order);

module.exports = route;