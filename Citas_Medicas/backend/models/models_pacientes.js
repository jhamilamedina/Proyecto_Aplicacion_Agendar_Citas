// Modelo (Pacientes)
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de tener la configuración correcta


const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),  // Nuevo campo agregado
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),  // Nuevo campo agregado
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otros'),
    defaultValue: 'otros',
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  historial_medico: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,  // Ajustado a DATE
    defaultValue: Sequelize.NOW,  // Usamos Sequelize.NOW
  },
  dni: {
    type: DataTypes.STRING(20),  // Nuevo campo agregado
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'Pacientes',
  timestamps: false,  // Deshabilitamos las columnas createdAt y updatedAt
});

module.exports = Paciente;
