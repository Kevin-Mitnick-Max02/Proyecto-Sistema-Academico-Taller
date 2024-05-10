const express = require ('express');
const rutas = express.Router();
const estudiantesModel = require('../models/academico');

// Creacion de EndPoint traer todos los estudiantes
rutas.get('/getEstudiantes',async(req, res)=>{
    try{
        const estudiante = await estudiantesModel.find();
        res.json(estudiante);
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
module.exports = rutas;