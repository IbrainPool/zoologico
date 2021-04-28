'use strict'

var express =  require('express');
var app = express();

var bodyParse = require('body-parser');
var usuarioRouter =  require('./router/usuario');

app.use(bodyParse.urlencoded({ extended: false}));
app.use(bodyParse.json())

app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    resp.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');  
    resp.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');    
    next();
});

app.use('/api/usuario', usuarioRouter);

module.exports = app;