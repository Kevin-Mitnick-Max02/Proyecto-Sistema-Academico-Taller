const express = require ('express');
const request = require ('supertest');
const estudianteRutas = require ('../../rutas/estudianterutas');
const estudianteModel = require ('../../models/academico');
const mongoose = require ('mongoose');
const app = express();
app.use(express.json());
app.use('/estudiantes', estudianteRutas);

describe('Pruebas Unitarias para Estudiantes',() => {
    // Se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appacademico',{
            useNewUrlParser : true,
        });
        await estudianteModel.deleteMany({});
    });
    afterAll(() =>{
        return mongoose.connection.close();
    });

    // Primer test getEstudiantes
    test('Deberia traer todos los estudiantes metodo: GET: getEstudiantes', async()=>{
        await estudianteModel.create({
            ci:6543342,
            nummatricula:'1',
            nombres:'Kevin Coner', 
            apellidos:'Camacho Rodriguez', 
            carrera: 'Sistemas Informaticos', 
            fecha_nacimiento:'1999-07-26', 
            municipio:'Punata', 
            direccion:'Av.Libertadores', 
            numero_celular:'76952344', 
            correo_electronico:'kevin@gmail.com'});
        await estudianteModel.create({ 
            ci: 7483920, 
            nummatricula: '2', 
            nombres: 'Maria Fernanda', 
            apellidos: 'Lopez Garcia', 
            carrera: 'Ingenieria Industrial', 
            fecha_nacimiento: '2000-02-15', 
            municipio: 'Cochabamba', 
            direccion: 'Calle Bolivia', 
            numero_celular: '71234567', 
            correo_electronico: 'mariaf@gmail.com' 
        });
        await estudianteModel.create({ 
            ci: 8523764, 
            nummatricula: '3', 
            nombres: 'Juan Carlos', 
            apellidos: 'Perez Ramirez', 
            carrera: 'Arquitectura', 
            fecha_nacimiento: '1998-11-20', 
            municipio: 'Sacaba', 
            direccion: 'Av. America', 
            numero_celular: '72345678', 
            correo_electronico: 'juancarlos@gmail.com' 
        });
        await estudianteModel.create({ 
            ci: 9345678, 
            nummatricula: '4', 
            nombres: 'Ana Sofia', 
            apellidos: 'Mendez Cruz', 
            carrera: 'Medicina', 
            fecha_nacimiento: '2001-05-30', 
            municipio: 'Quillacollo', 
            direccion: 'Calle Heroes', 
            numero_celular: '73456789', 
            correo_electronico: 'anasofia@gmail.com' 
        });
        await estudianteModel.create({ 
            ci: 8765432, 
            nummatricula: '5', 
            nombres: 'Luis Alberto', 
            apellidos: 'Rojas Fernandez', 
            carrera: 'Derecho', 
            fecha_nacimiento: '1997-09-10', 
            municipio: 'Tiquipaya', 
            direccion: 'Av. Circunvalacion', 
            numero_celular: '74567890', 
            correo_electronico: 'luisalberto@gmail.com' 
        });
        //  solicitud - request
        const res = await request(app).get('/estudiantes/getEstudiantes');
        // console.log(res);
        // verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(5);
    }, 10000);

    // 2do test Crear o Registrar
    test ('Deberia de agregar un nuevo Estudiante: POST: /registrar', async() => {
        const nuevoEstudiante = {
            ci: 9654321, 
            nummatricula: '6', 
            nombres: 'Daniela Alejandra', 
            apellidos: 'Gutierrez Moreno', 
            carrera: 'Ingenieria Civil', 
            fecha_nacimiento: '1999-03-17', 
            municipio: 'Vinto', 
            direccion: 'Calle Principal', 
            numero_celular: '75678901', 
            correo_electronico: 'daniela@gmail.com' 
        };
        const res =  await request(app)
                            .post('/estudiantes/Registrar')
                            .send(nuevoEstudiante);
        expect(res.statusCode).toEqual(201);
        expect(res.body.ci).toEqual(nuevoEstudiante.ci);
    });
    // 3er test Editar o Actualizar
    test('Deberia actualizar un estudiante que ya existe: PUT /editar/:id', async()=>{
        const estudianteCreado = await estudianteModel.create(
                                  { ci:6543342,
                                    nummatricula:'1',
                                    nombres:'Kevin Coner', 
                                    apellidos:'Camacho Rodriguez', 
                                    carrera: 'Sistemas Informaticos', 
                                    fecha_nacimiento:'1999-07-26', 
                                    municipio:'Punata', 
                                    direccion:'Av.Libertadores', 
                                    numero_celular:'76952344', 
                                    correo_electronico:'kevin@gmail.com'});
        const estudianteActualizar = {
            ci:6543342,
            nummatricula:'1',
            nombres:'Kevin Coner', 
            apellidos:'Camacho Rodriguez', 
            carrera: 'Sistemas Informaticos', 
            fecha_nacimiento:'1999-07-26', 
            municipio:'Arani', 
            direccion:'Calle Avaroa', 
            numero_celular:'76952344', 
            correo_electronico:'kevin@gmail.com'
        };
        const res =  await request(app)
                            .put('/estudiantes/editar/'+estudianteCreado._id)
                            .send(estudianteActualizar);
        expect(res.statusCode).toEqual(200); // A la ing le dio con 201
        expect(res.body.ci).toEqual(estudianteActualizar.ci);                   
    });
    // 4to test Eliminar
    test('Deberia eliminar un estudiante existente : DELETE /eliminar/:id', async() =>{
        const estudianteCreada = await estudianteModel.create(
            {   ci: 9876543, 
                nummatricula: '7', 
                nombres: 'Roberto Carlos', 
                apellidos: 'Martinez Suarez', 
                carrera: 'Ingenieria Electrica', 
                fecha_nacimiento: '1996-12-05', 
                municipio: 'Tarata', 
                direccion: 'Calle Colon', 
                numero_celular: '76789012', 
                correo_electronico: 'roberto@gmail.com' });
        const res =  await request(app)
                                .delete('/estudiantes/eliminar/'+estudianteCreada._id);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje :  'Estudiante Eliminado!'});
    }); 
});