const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/category.controller');

route.get('/', controller.index);

route.post('/add', controller.add);

module.exports = route;