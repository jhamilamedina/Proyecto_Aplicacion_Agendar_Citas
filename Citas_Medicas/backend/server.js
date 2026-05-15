require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');

// Configurar Sequelize con las variables de entorno
const sequelize = new Sequelize("DBClinica", "root", "123", {
    host: "localhost",
    dialect: "mysql",  // Usar 'mysql' como valor por defecto si DB_DIALECT no está definido
    port: 3306,
});

// Exportar `sequelize` para que esté disponible en otros archivos
module.exports = sequelize;

// Rutas
const citasRouter = require('./router/RouterCitas');
const disponibilidadRouter = require('./router/RouterDisponibilidad');
const doctoresRouter = require('./router/RouterDoctor');
const especialidadesRouter = require('./router/RouterEspecialidades');
const pacientesRouter = require('./router/RouterPacientes');
const usuarioRouter = require('./router/RouterUsuarios');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(helmet());
app.use(express.json());

// Rutas
app.use('/api/citas', citasRouter);  // Ruta pública para citas
app.use('/api/disponibilidad', disponibilidadRouter);  // Ruta pública para disponibilidad
app.use('/api/especialidades', especialidadesRouter);  // Ruta pública para especialidades
app.use('/api/pacientes', pacientesRouter);  // Ruta pública para pacientes
app.use('/api/doctores', doctoresRouter);  // Ruta pública para doctores
app.use('/api/usuarios', usuarioRouter);  // Ruta pública para usuarios

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

// Sincronización con la base de datos y levantamiento del servidor
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.error('Unable to connect to the database:', error));
