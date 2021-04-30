'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
const { exists } = require('../model/usuario');

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

function upload(req, res) {

    var usuarioID = req.params.id;

    if(req.files) {
        console.log(req.files);

        var file_path = req.files.files.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        console.log(file_name);
        var  ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        console.log(file_ext);

        if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'jpeg') {

            if( req.user && usuarioID !==  req.user.sub) {
                return res.status(403).send({
                    message: 'No tienes permiso para actualizar el registro.'
                });
            }

            UsuarioModel.findByIdAndUpdate(usuarioID, 
                {images: file_name }, 
                { new: false}, 
                (err, usuarioActualizado ) => {
                    if(err) {
                        res.status(500).send({message: ' Error del sistema'});
                    } else {
                        if(!usuarioActualizado) {
                            res.status(404).send({message: 'Usuario no encontrado'});

                        } else {
                            
                            deleteImage(usuarioActualizado.images);
                            res.status(200).send({
                                message: 'Registro Actualizado',
                                'usuario': usuarioActualizado,
                                'image': file_name
                            });
                        }
                    }
                });


        } else {
            //extensiones no validas
            fs.unlink(file_path, (err) => {
                if(err) {
                    res.status(500).send({
                        message : 'Extension no valida y fichero no eliminado.'
                    });
                } else {
                    res.status(200).send({
                        message: 'Extension no es valida.'
                    });
                }
            });
        }
        
    } else {
        res.status(200).send({
            message: 'No existe ficheros.'
        });
    }

}

function deleteImage(filename) {
    var path_imagen = './upload/usuarios/'+filename;
    fs.unlink(path_imagen, (err) => {
        if(err) {
            console.error('Error', err);
        } else {
           console.log('Fichero Elimnado ', filename);
        }
    });
}

function getImagen(req, res) {

    var imagefile = req.params.id;
    var path_imagen = './upload/usuarios/'+imagefile;
    console.log(path_imagen);
    fs.exists(path_imagen, function(imagen) {
        if(imagen) {
            res.sendFile(path.resolve(path_imagen));
        } else {
            res.status(404).send({
                message: 'imagen no encontrada.'
            });
        }
    });
}

module.exports = {
    save, 
    upload,
    getImagen
}