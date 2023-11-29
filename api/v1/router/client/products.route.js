const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/product.controller');
const authMiddlerware = require('../../middlerwares/auth.middlerware');

route.get('/', controller.index);

route.get('/detail/:id', controller.detail);

route.get('/compare', controller.compare);

module.exports = route;