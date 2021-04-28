'use strict'

var jwt =  require('jwt-simple');
var moment  = require('moment');
var clavesecreta = "cursoNodeJs2021";

exports.createToken = function(usuarioModel) {

    var payload = {
        sub: usuarioModel._id,
        nombre:usuarioModel.nombre,
        apellido : usuarioModel.apellido,
        correo : usuarioModel.correo,
        role : usuarioModel.role,
        images : usuarioModel.images,
        clave : usuarioModel.clave,
        iat: moment().unix(),
        exp: moment().add(1, 'day').unix()
    };

    return jwt.encode(payload, clavesecreta);
};