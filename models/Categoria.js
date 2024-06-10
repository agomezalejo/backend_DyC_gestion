'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      this.hasMany(models.Gasto, {
        foreignKey: 'id_categoria',
        as: 'gastos'
      });
    }
  }

  Categoria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING
      },
      color: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'Categoria',
      tableName: 'categorias',
      timestamps: false
    }
  );

  return Categoria;
};
