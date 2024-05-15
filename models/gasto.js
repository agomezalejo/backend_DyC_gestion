'use strict';
const {
  Model
} = require('sequelize');

const Usuarios = require('../models').usuario;

module.exports = (sequelize, DataTypes) => {
  class Gastos extends Model {

    static associate(models) {
        Gastos.belongsToMany(Usuarios, { through: 'UsuarioGasto' });
    }
  }
  Gastos.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    categorias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING,
    },
    etiquetas: {
      type: DataTypes.STRING,
    },
    liquidacion: {
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'gastos',
    timestamps: false
  });
  return Gastos;
};