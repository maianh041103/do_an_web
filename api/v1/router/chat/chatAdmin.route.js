const express = require('express');
const controller = require('../../controller/chat/chat.controller');

const route = express.Router();

route.get('/', controller.listUser);

route.get('/detail', controller.indexAdmin);

module.exports = route;