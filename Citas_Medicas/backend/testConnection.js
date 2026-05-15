// Cargar las variables de entorno
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Crear una instancia de Sequelize con las variables de entorno
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'  // Usar 'mysql' si no se define DB_DIALECT
});

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });
    