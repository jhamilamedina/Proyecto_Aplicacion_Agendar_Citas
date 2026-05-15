// Modelo Especialidades (Especialidades)
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de tener la configuración correcta

const especialidad = sequelize.define('especialidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW, // Ajuste para usar Sequelize.NOW
  }
}, {
  tableName: 'Especialidades',
  timestamps: false, // Aseguramos que no se creen las columnas de createdAt y updatedAt automáticamente
});

module.exports = especialidad;
