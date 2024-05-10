//Llamado de librerias
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
// ruta
const estudianteRutas1 = require('./rutas/estudianterutas');

// configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());
//conexion con mongo db
    mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exisota!');
        app.listen(PORT, ()=>{console.log("Servidor corriendo en el puerto "+PORT)})
    }
).catch(error => console.log('Error de conexion!',error));
// utilizar las rutas de estudiantes
app.use('/estudiantes',estudianteRutas1);