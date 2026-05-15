// Modelo (Disponibilidad)
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de que la configuración de la conexión a la base de datos sea correcta

const disponibilidad = sequelize.define('disponibilidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dia_de_semana: {
    type: DataTypes.ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'),
    allowNull: true,
  },
  horario_inicio: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  horario_final: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,  // Cambiado a DataTypes.DATE
    defaultValue: Sequelize.NOW,  // Usamos Sequelize.NOW
  }
}, {
  tableName: 'disponibilidad',
  timestamps: false,  // Deshabilitamos createdAt y updatedAt
});

module.exports = disponibilidad;
