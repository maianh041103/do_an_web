const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/favorite.controller');

route.get('/', controller.index);

route.get('/add/:id', controller.addFavorite);

route.delete('/delete/:id', controller.deleteFavourite);

module.exports = route;