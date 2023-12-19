const express = require('express');
const controller = require('../../controller/chat/chat.controller');

const route = express.Router();

route.get('/', controller.indexClient);

module.exports = route;