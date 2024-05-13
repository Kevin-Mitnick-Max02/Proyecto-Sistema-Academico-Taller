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
// EndPoint 2, Crear
rutas.post('/registrar', async (req, res) => {
    const estudiante = new estudiantesModel({
        id: req.body.id,
        ci: req.body.ci,
        nummatricula: req.body.nummatricula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fecha_nacimiento,
        municipio: req.body.municipio,
        direccion: req.body.direccion,
        numero_celular: req.body.numero_celular,
        correo_electronico: req.body.correo_electronico
    })
    try{
        const nuevoEstudiante = await estudiante.save();
        res.status(201).json(nuevoEstudiante);
    }catch(error){
        res.status(400).json({message : error.message});
    }
});
//EndPoint 3, Editar
rutas.put('/editar/:id', async (req, res) => {
    try{
        const  estudianteEditado = await estudiantesModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if(!estudianteEditado){
            return res.status(404).json({mensaje: 'Estudiante no encontrada!'});
        }else{
            return res.json(estudianteEditado);
        }
    }catch (error){
        res.status(400).json({mensaje : error.message});
    }
});
//End Point 4 Eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try{
        const estudianteEliminado = await estudiantesModel.findByIdAndDelete(req.params.id);
        if(!estudianteEliminado){
            return res.status(404).json({mensaje : 'Estudiante no encontrado!'});
        }else{
            return res.json({mensaje : 'Estudiante Eliminado!'});
        }
    }catch(error){
        res.status(500).json({mensaje : error.message});
    }
});
module.exports = rutas;