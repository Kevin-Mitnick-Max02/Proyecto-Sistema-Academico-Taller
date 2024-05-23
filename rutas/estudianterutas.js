const express = require ('express');
const rutas = express.Router();
const estudiantesModel = require('../models/academico');
const UsuarioModel = require('../models/usuario');

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
        carrera: req.body.carrera,
        fecha_nacimiento: req.body.fecha_nacimiento,
        municipio: req.body.municipio,
        direccion: req.body.direccion,
        numero_celular: req.body.numero_celular,
        correo_electronico: req.body.correo_electronico,
        usuario: req.body.usuario // Asignacion del id usuario
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

//- EndPoint 5, obtener una estudiante por su ID
rutas.get('/estudiante/:id', async (req, res) => {
    try{
        const estudiante = await estudiantesModel.findById(req.params.id);
        if(!estudiante)
            return res.status(404).json({mensaje : 'Estudiante no encontrado!'});
        else
            return res.json(estudiante);
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
//- EndPoint 6, obtener estudiante por municipio especifico
rutas.get('/estudiantePorMunicipio/:municipios', async(req, res) => {
    try{
        const estudianteMunicipio = await estudiantesModel.find({municipio : req.params.municipios});
        return res.json(estudianteMunicipio);
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
//- EndPoint 7, eliminar todos los estudiantes 
rutas.delete('/EliminarTodos', async(req, res) => {
    try{
        await estudiantesModel.deleteMany({});
        return res.json({mensaje : 'Todos los estudiantes han sido eliminados'});
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
//- EndPoint 8, contar el numero total de estudiantes
rutas.get('/TotalEstudiantes', async(req, res) => {
    try{
        const total = await estudiantesModel.countDocuments();
        return res.json({TotalEstudiantes: total});
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
//- EndPoint 9, obtener estudiantes ordenadas por nombre ascendente
rutas.get('/ordenarEstudiantes', async(req, res) => {
    try{
        const estudiantesOrdenados = await estudiantesModel.find().sort({nombres : 1});
        res.status(200).json(estudiantesOrdenados);
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
// EndPoint 10, filtrar estudiantes por carrera
rutas.get('/filtrarporcarrera/:carrera', async (req, res) => {
    const carrera = req.params.carrera;
    try {
      const estudiantes = await estudiantesModel.find({ carrera : req.params.carrera});
      return res.json(estudiantes);
    } catch (error) {
        return res.status(500).json({mensaje: error.message});
    }
  });
//- EndPoint 11, obtener estudiantes ordenadas por apellido ascendente
rutas.get('/ordenarEstudiantesAP', async(req, res) => {
    try{
        const estudiantesOrdenadosAP = await estudiantesModel.find().sort({apellidos : 1});
        res.status(200).json(estudiantesOrdenadosAP);
    }catch(error){
        res.status(500).json({mensaje: error.message});
    }
});  
// EndPoint 12, busqueda de estudiantes por su número de matrícula
rutas.get('/matricula/:nummatricula', async (req, res) => {
    const nummatricula = req.params.nummatricula;
    try {
      const estudiante = await estudiantesModel.findOne({ nummatricula });
      res.json(estudiante);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
});
// EndPoint 13, Buscar estudiantes por número de celular o correo electrónico
rutas.get('/busqueda/:termino', async (req, res) => {
    const termino = req.params.termino;
    try {
      const estudiantes = await estudiantesModel.find({
        $or: [
          { numero_celular: { $regex: termino, $options: 'i' } },
          { correo_electronico: { $regex: termino, $options: 'i' } }
        ]
      });
      res.json(estudiantes);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
  });
// EndPoint 14, Busqueda estudiantes por coincidencia de nombre o apellido
rutas.get('/nombresapellidos/:termino', async (req, res) => {
    const termino = req.params.termino;
    try {
      const estudiantes = await estudiantesModel.find({
        $or: [
          { nombres: { $regex: termino, $options: 'i' } },
          { apellidos: { $regex: termino, $options: 'i' } }
        ]
      });
      res.json(estudiantes);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
  });
// EndPoint 15, Obtener estudiantes ordenados por fecha de nacimiento
rutas.get('/fecha_nacimiento/:orden', async (req, res) => {
    const orden = req.params.orden === 'asc' ? 1 : -1;
    try {
      const estudiantes = await estudiantesModel.find().sort({ fecha_nacimiento: orden });
      res.json(estudiantes);
      console.log(orden);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
  });

//REPORTES 1
rutas.get('/estudiantePorUsuario/:usuarioId', async (req, res) => {
    const {usuarioId} = req.params;
   // console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        console.log(usuario);
        if (!usuario)
            return res.status(404).json({mensaje: 'usuario no encontrado'});
        const estudiante = await estudiantesModel.find({ usuario: usuarioId}).populate('usuario');
        res.json(estudiante);

    } catch(error){
        res.status(500).json({ mensaje :  error.message});
    }
});

//REPORTES 2
// mostrar a todos los estudiantes registrados por un usuario con un ID específico, que vivan en Arani
rutas.get('/estudiantesPorUsuarioYMunicipio/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const estudiantes = await estudiantesModel.find({ usuario: usuarioId, municipio: 'Arani' }).populate('usuario');
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
module.exports = rutas;