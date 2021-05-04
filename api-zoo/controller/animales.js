'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
const { exists } = require('../model/animales');

//modelos
var AnimalesModel =  require('../model/animales');

var jwt =  require('../service/jwt');

function save(req, res) {
    var animales = new AnimalesModel();

    var params = req.body;

    if(params.especie && params.clase && params.orden && params.habitat) {

        animales.especie =  params.especie;
        animales.clase =  params.clase;
        animales.orden =  params.orden;
        animales.familia =  params.familia;
        animales.habitat =  params.habitat;
        animales.images = null;

        AnimalesModel.findOne({
            'especie': animales.especie
        }, (err, animalesExiste) => {
            if(err) {
                res.status(500).send({
                    message: ' Error del Servidor'
                });
            } else {
                if(!animalesExiste) {
                    {
                        if(err) {
                            res.status(500).send({message:'Error del sistema'});
                        } else {

                            animales.save((err, animalesSave) => {
                                if(err) {
                                    res.status(500).send({message:'Error del sistema'});
                                } else {
                                    if(!animalesSave) {
                                        res.status(500).send({message:'Animal no registrado'});
                                    } else {
                                        res.status(200).send({
                                            'animales': animalesSave
                                        });
                                    }
                                }
                            });
                        }


                    };
                    
                } else {
                    res.status(200).send({
                        message: 'El animal ya esta registrado.'
                    }); 
                }
            }
        });


    } else {
        res.status(404).send({
            message: 'Datos insuficientes.'
        });
    }
}

function upload(req, res) {

    var animalesID = req.params.id;

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

            if( req.user && animalesID !==  req.user.sub) {
                return res.status(403).send({
                    message: 'No tienes permiso para actualizar el registro.'
                });
            }

            AnimalesModel.findByIdAndUpdate(animalesID, 
                {images: file_name }, 
                { new: false}, 
                (err, animalesActualizado ) => {
                    if(err) {
                        res.status(500).send({message: ' Error del sistema'});
                    } else {
                        if(!animalesActualizado) {
                            res.status(404).send({message: 'Animal no encontrado'});

                        } else {
                            
                            deleteImage(animalesActualizado.images);
                            res.status(200).send({
                                message: 'Registro Actualizado',
                                'animales': animalesActualizado,
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
    var path_imagen = './upload/animales/'+filename;
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
    var path_imagen = './upload/animales/'+imagefile;
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