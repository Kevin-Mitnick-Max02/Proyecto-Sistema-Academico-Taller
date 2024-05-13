const mongoose = require ('mongoose');
// Definir esquema
const academicoSchema = new mongoose.Schema({
    //nombre: {type: String, require: true}
    id: Number,
    ci: Number,
    nummatricula: String,
    nombres: String,
    apellidos: String,
    carrera: String,
    fecha_nacimiento: String,
    municipio: String,
    direccion: String,
    numero_celular: String,
    correo_electronico: String
});
const estudiantesModel = mongoose.model('estudiante', academicoSchema, 'academico');
module.exports = estudiantesModel;