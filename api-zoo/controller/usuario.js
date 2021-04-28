'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var UsuarioModel =  require('../model/usuario');

var jwt =  require('../service/jwt');

function save(req, res) {
    var usuario = new UsuarioModel();

    var params = req.body;

    if(params.clave && params.nombre && params.correo && params.apellido) {

        usuario.nombre =  params.nombre;
        usuario.apellido =  params.apellido;
        usuario.clave = params.clave;
        usuario.correo = params.correo.toLowerCase();
        usuario.role = 'ROLE_USER';
        usuario.images = null;

        UsuarioModel.findOne({
            'correo': usuario.correo
        }, (err, usuarioExiste) => {
            if(err) {
                res.status(500).send({
                    message: ' Error del Servidor'
                });
            } else {
                if(!usuarioExiste) {
                    
                    //codificar contraseña
                    bcrypt.hash(usuario.clave, null, null, function(err, hash) {
                        if(err) {
                            res.status(500).send({message:'Error del sistema'});
                        } else {
                            usuario.clave =  hash;
                            usuario.save((err, usuarioSave) => {
                                if(err) {
                                    res.status(500).send({message:'Error del sistema'});
                                } else {
                                    if(!usuarioSave) {
                                        res.status(500).send({message:'Usuario no registrado'});
                                    } else {
                                        res.status(200).send({
                                            'usuario': usuarioSave
                                        });
                                    }
                                }
                            });
                        }


                    });
                    
                } else {
                    res.status(200).send({
                        message: 'El usuario ya se encuentra registrado.'
                    }); 
                }
            }
        });


    } else {
        res.status(404).send({
            message: 'Datos de entrada incorrectos.'
        });
    }
}


module.exports = {
    save
}