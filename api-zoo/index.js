'use strict'

var mongoose  = require('mongoose');

var app = require('./app');
var port = process.env.port || 3789;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true })
    .then(() => {
        console.log('Conexion de Base de datos existosa...');

        app.listen(port, () => {
            console.log('Servicios activados...');
        });
    })
    .catch( err => {
            console.error('Error de Conexion', err);
        }
    );

