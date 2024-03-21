// import mysql2 from 'mysql2';
// import express from 'express';
// import path from 'path'; // Importa el módulo 'path' para trabajar con rutas de archivos
// const app = express();

// // Establece la ruta de las vistas (plantillas) usando el módulo 'path'
// app.set('views', path.join(__dirname, 'views'));

// // Establece el motor de plantillas Handlebars
// app.set('view engine', 'hbs');

// // Crear conexión MySQL
// const conexion = mysql2.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'anto123456789',
//     database: 'usuariosclientes',
// });

// // Conectar a MySQL
// conexion.connect(function(error) {
//     if (error) {
//         throw error;
//     } else {
//         console.log('Conexión exitosa a MySQL');
//     }
// });

// // Cerrar conexión MySQL al finalizar la aplicación
// process.on('exit', () => {
//     conexion.end();
// });

// // Ruta para obtener y mostrar los datos de los clientes
// app.get('/clientes', (req, res) => {
//     // Realizar consulta a la base de datos para obtener los clientes
//     conexion.query('SELECT * FROM clientes', (error, results) => {
//         if (error) {
//             throw error;
//         } else {
//             // Renderizar la plantilla cliente.hbs y pasar los resultados de la consulta
//             res.render('cliente', { clientes: results });
//         }
//     });
// });

// export default app;
