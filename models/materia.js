const mongoose = require ('mongoose');
// Definir esquema
const materiaSchema = new mongoose.Schema({
    //nombre: {type: String, require: true}
    id: Number,
    materiaID: Number,
    nombre: String,
    descripcion: String,
    creditos: Number,
    docenteCI: Number,
    docente: { type: mongoose.Schema.Types.ObjectId, ref: 'docente'}
});
const materiaModel = mongoose.model('materia', materiaSchema, 'materia');
module.exports = materiaModel;