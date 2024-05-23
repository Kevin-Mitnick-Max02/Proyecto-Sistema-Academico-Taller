//Llamado de librerias
const express = require('express');
const mongoose = require('mongoose');
const authRutas = require ('./rutas/authRutas');
const Usuario = require ('./models/usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
// ruta
const estudianteRutas1 = require('./rutas/estudianterutas');
const docenteRutas = require('./rutas/docenterutas');
const materiaRutas = require('./rutas/materiarutas');

// configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());

//conexion con mongo db
    mongoose.connect(MONGO_URI).then(() => {
        console.log('Conexion exisota!');
        app.listen(PORT, ()=>{console.log("Servidor corriendo en el puerto "+PORT)})
    }
).catch(error => console.log('Error de conexion!',error));

const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

app.use('/auth', authRutas);
app.use('/estudiantes', autenticar, estudianteRutas1);
app.use('/docentes', autenticar, docenteRutas);
app.use('/materias', autenticar, materiaRutas);
// utilizar las rutas de estudiantes
//app.use('/estudiantes',estudianteRutas1);