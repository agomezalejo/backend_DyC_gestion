'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GrupoUsuario extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
    }
  }

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
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
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
