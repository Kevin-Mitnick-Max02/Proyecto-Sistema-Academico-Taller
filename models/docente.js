const mongoose = require ('mongoose');
// Definir esquema
const docenteSchema = new mongoose.Schema({
    //nombre: {type: String, require: true}
    id: Number,
    docenteCI: Number,
    nombres: String,
    apellidos: String,
    correo_electronico: String,
    departamento: String
});
const docenteModel = mongoose.model('docentes', docenteSchema, 'docente');
module.exports = docenteModel;