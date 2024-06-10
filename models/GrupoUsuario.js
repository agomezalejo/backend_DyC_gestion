'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GrupoUsuario extends Model {}

  GrupoUsuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'GrupoUsuario',
      tableName: 'grupos_usuarios',
      timestamps: false
    }
  );

  return GrupoUsuario;
};
