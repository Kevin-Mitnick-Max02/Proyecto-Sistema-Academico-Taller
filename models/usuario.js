const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const usuarioSchema = new mongoose.Schema({
    //nombre: {type: String, require: true}
    nombreusuario: {
        type: String,
        required : true,
        unique : true
    },
    correo : {
        type: String,
        required : true,
        unique : true
    },
    contrasenia : {
        type : String,
        required : true
    }
});


usuarioSchema.pre('save',async function (next){
    if (this.isModified('contrasenia')){
        this.contrasenia = await bcrypt.hash(this.contrasenia, 10);
        console.log(this.contrasenia);
    }
    next();
});
//comparar contrasenias
usuarioSchema.methods.compararContrasenia = async function (contraseniaComparar){
    return await bcrypt.compare(contraseniaComparar, this.contrasenia);
}

const usuarioModel = mongoose.model('Usuario', usuarioSchema,'usuario');
module.exports = usuarioModel;