import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql2 from 'mysql2';

// Inicializar la aplicación Express
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware: Logger de solicitudes HTTP
app.use(morgan('dev'));

// Middleware para analizar datos codificados en URL y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de las vistas y el motor de plantillas Handlebars
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views', 'layouts'),
    partialsDir: join(__dirname, 'views', 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middleware para servir archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para la página de ventas
app.get('/ventas', (req, res) => {
    res.render('index2', { layout: 'main2' });
});

// Ruta para procesar el formulario de compra
app.post('/realizarCompra', (req, res) => {
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const cantidad = req.body.cantidad;
    const productImage = req.body.productImage;

    // Calcula el precio total
    const totalPrice = productPrice * cantidad;

    // Renderiza la página de la factura con los datos necesarios
    res.render('index3', { productName, productPrice, cantidad, totalPrice, productImage, layout: 'main3' });
});

// Iniciar el servidor
app.listen(process.env.PORT || 3000, () => {
    console.log('App running at http://localhost:3000');
});
// Crear conexión MySQL
const conexion = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'anto123456789',
    database: 'usuariosclientes',
});

// Conectar a MySQL
conexion.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión exitosa a MySQL');
    }
});

// Cerrar conexión MySQL al finalizar la aplicación
process.on('exit', () => {
    conexion.end();
});

// Ruta para obtener y mostrar los datos de los clientes
app.get('/clientes', (req, res) => {
    // Realizar consulta a la base de datos para obtener los clientes
    conexion.query('SELECT * FROM clientes', (error, results) => {
        if (error) {
            throw error;
        } else {
            // Renderizar la plantilla cliente.hbs y pasar los resultados de la consulta
            res.render('index4', { clientes: results, layout: 'main4' });
        }
    });
});
// Ruta para mostrar el formulario de agregar nuevo cliente
app.get('/clientes/nuevo', (req, res) => {
    res.render('index4',{layout:'maincrear'}); // Aquí renderiza el formulario HTML para agregar nuevo cliente
});

// Ruta para agregar un nuevo cliente (CREATE)
app.post('/clientes/nuevo', (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;
    const nuevoCliente = { nombre, email, telefono, direccion };
    conexion.query('INSERT INTO clientes SET ?', nuevoCliente, (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Nuevo cliente insertado:', result);
            // Redirigir a la página de clientes después de la inserción
            res.redirect('/clientes');
        }
    });
});


// Ruta para eliminar un cliente (DELETE)
app.post('/clientes/eliminar/:id', (req, res) => {
    const idCliente = req.params.id;
    conexion.query('DELETE FROM clientes WHERE id = ?', [idCliente], (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Cliente eliminado:', result);
            res.redirect('/clientes');
        }
    });
});
app.get('/clientes/editar/:id', (req, res) => {
    const idCliente = req.params.id;
    // Realizar consulta a la base de datos para obtener los datos del cliente específico
    conexion.query('SELECT * FROM clientes WHERE id = ?', [idCliente], (error, results) => {
        if (error) {
            throw error;
        } else {
            // Renderizar la vista del formulario de edición y pasar los datos del cliente
            res.render('index4', { cliente: results[0], layout: 'maineditar' });
        }
    });
});

// Ruta para actualizar un cliente (UPDATE)
app.post('/clientes/editar/:id', (req, res) => {
    const idCliente = req.params.id;
    const { nombre, email, telefono, direccion } = req.body;
    const clienteActualizado = { nombre, email, telefono, direccion };
    conexion.query('UPDATE clientes SET ? WHERE id = ?', [clienteActualizado, idCliente], (error, result) => {
        if (error) {
            throw error;
        } else {
            console.log('Cliente actualizado:', result);
            res.redirect('/clientes');
        }
    });
});

export default app;
