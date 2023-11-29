const express = require('express');
const route = express.Router();

const controller = require('../../controller/client/feedback.controller');

route.post('/create', controller.create);

module.exports = route;
