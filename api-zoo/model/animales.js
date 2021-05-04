'use strict'

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

var AnimalesModel = Schema(
    {
        especie : String,
        clase : String,
        orden : String,
        familia : String,
        habitat : String,
        images : String
        
    }, {
        versionKey: false
    }
);

module.exports =  mongoose.model('Animales', AnimalesModel);