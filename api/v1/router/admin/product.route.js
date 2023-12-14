const express = require('express');
const route = express.Router();

const controller = require('../../controller/admin/product.controller');
const authAdminMiddlerware = require('../../middlerwares/authAdmin.middlerware');

const multer = require("multer");
const upload = multer();
const uploadClound = require("../../middlerwares/uploadClound.middlerware.js");

route.get('/', authAdminMiddlerware.authProductView, controller.index);

route.post('/add', authAdminMiddlerware.authProductView, controller.add);

route.patch('/edit/:id', authAdminMiddlerware.authProductEdit, controller.edit);

route.patch('/uploadImage', upload.array('images', 8), uploadClound.uploadArray, authAdminMiddlerware.authProductEdit, controller.uploadImage);

route.delete('/delete/:id', authAdminMiddlerware.authProductDelete, controller.delete);

module.exports = route;