// Modelo (Usuarios)
const { DataTypes } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de tener la configuración correcta

const Usuario = sequelize.define('Usuario', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
  },
  password: {
      type: DataTypes.STRING(255),
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
  },
  role: {
      type: DataTypes.ENUM('admin', 'usuario'),
      defaultValue: 'usuario',
  },
  fecha_creacion: {
      type: DataTypes.DATE,  // Cambié a DATE para evitar problemas con TIMESTAMP
      defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  
});

module.exports = Usuario;
