'use strict'

var express =  require('express');
var usuarioController =  require('../controller/usuario');

var api = express.Router();

api.post('/', usuarioController.save);

module.exports = api;