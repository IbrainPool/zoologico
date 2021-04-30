'use strict'

var express =  require('express');
var multipart = require('connect-multiparty');

var usuarioController =  require('../controller/usuario');

var api = express.Router();
var dirUpload = multipart({ uploadDir: './upload/usuarios'});

api.post('/', usuarioController.save);
api.post('/image/:id', [dirUpload], usuarioController.upload);
api.get('/image/:id', usuarioController.getImagen);

module.exports = api;