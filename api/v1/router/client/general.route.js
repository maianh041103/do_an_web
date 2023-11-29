const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/general.controller');

route.get('/setting', controller.setting);

module.exports = route;