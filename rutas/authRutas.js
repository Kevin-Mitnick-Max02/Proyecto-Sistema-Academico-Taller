const express = require ('express');
const rutas = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

let tokensRevocados = [];
// Registro
rutas.post ('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia} = req.body;
        const usuario = new Usuario ({ nombreusuario, correo, contrasenia});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado'});
    }
    catch(error){
        res.status(500).json({mensaje: 'Error de registro de usuario'});
    }
});
// Middleware para verificar el token
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    if (tokensRevocados.includes(token)) {
        return res.status(401).json({ mensaje: 'Token revocado. Por favor, inicie sesión de nuevo.' });
    }
    jwt.verify(token, 'clave_secreta', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token no válido' });
        }
        req.usuarioId = decoded.usuarioId;
        next();
    });
}

// Inicio de sesion
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const {correo, contrasenia} = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario)
            return res.status(401).json({error: 'Correo invalido !!!'});
            const validarContrasena = await usuario.compararContrasenia(contrasenia);
        if (!validarContrasena)
            return res.status(401).json({error: 'Contrasenia invalido !!!'});
        // Creacion de token
        const token = jwt.sign({ usuarioId: usuario._id },'clave_secreta', {expiresIn: '5h'});
        res.json({token});
    }   
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
/*
// Cerrar sesión
rutas.post('/cerrarsesion', (req, res) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    console.log(token);
    tokensRevocados.push(token);
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
});
*/
// Aplicar el middleware a las rutas que requieren autenticación
// rutas.use(verificarToken);
module.exports = rutas;