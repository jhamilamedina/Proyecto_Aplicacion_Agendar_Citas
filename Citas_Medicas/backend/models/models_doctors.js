// Modelo Doctor (Médicos)
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de tener la configuración correcta

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  specialty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  telefono: {  // Ajuste: Cambiado de "teléfono" a "telefono"
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,  // Cambiado a DataTypes.DATE
    defaultValue: Sequelize.NOW,  // Usamos Sequelize.NOW
  }
}, {
  tableName: 'doctors',
  timestamps: false,  // Deshabilitamos createdAt y updatedAt
});

module.exports = Doctor;
