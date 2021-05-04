'use strict'

var express =  require('express');
var multipart = require('connect-multiparty');

var animalesController =  require('../controller/animales');

var api = express.Router();
var dirUpload = multipart({ uploadDir: './upload/animales'});

api.post('/', animalesController.save);
api.post('/image/:id', [dirUpload], animalesController.upload);
api.get('/image/:id', animalesController.getImagen);

module.exports = api;