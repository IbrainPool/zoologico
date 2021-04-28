'use strict'

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

var UsuarioModel = Schema(
    {
        nombre : String,
        apellido : String,
        correo : String,
        role : String,
        images : String,
        clave : String
    }, {
        versionKey: false
    }
);

module.exports =  mongoose.model('Usuario', UsuarioModel);