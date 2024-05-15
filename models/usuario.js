'use strict';
const {
  Model
} = require('sequelize');

const Gastos = require('../models').gasto;

module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {

    static associate(models) {
      Usuarios.belongsToMany(Gastos, { through: 'UsuarioGasto' });
    }
  }
  Usuarios.init({
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'usuarios',
    timestamps: false
  });
  return Usuarios;
};