const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/home.controller');

route.get('/', controller.index);

route.get('/home/productCategory', controller.productCategory);

route.get('/home/productBestSellers', controller.productBestSellers);

route.get('/home/productFeatureds', controller.productFeatureds);

route.get('/home/productBestRate', controller.productBestRate);

module.exports = route;
