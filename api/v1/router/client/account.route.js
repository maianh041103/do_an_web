const express = require('express');
const route = express.Router();

const multer = require("multer");
const upload = multer();

const controller = require('../../controller/client/account.controller');

const authValidate = require('../../validate/auth.validate');
const authMiddlerware = require('../../middlerwares/auth.middlerware');

const uploadClound = require("../../middlerwares/uploadClound.middlerware.js");

route.post('/register', authValidate.authRegister, controller.register);

route.post('/login', authValidate.authLogin, controller.login);

route.post('/forgot/email', authValidate.forgotPassword, controller.email);

route.post('/forgot/otp', controller.otp);

route.patch('/forgot/reset', controller.reset);

route.get('/detail', authMiddlerware.authMiddler, controller.detail);

route.patch('/uploadImage', upload.single('avatar'), uploadClound.uploadSingle, authMiddlerware.authMiddler, controller.uploadImage);

route.patch('/edit', authMiddlerware.authMiddler, controller.edit);

route.post('/change-password/old-password', authMiddlerware.authMiddler, controller.oldPassword);

route.patch('/change-password/resetChangePasword', authMiddlerware.authMiddler, controller.reset);

route.get('/logout', authMiddlerware.authMiddler, controller.logout);
module.exports = route;
