'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto');


module.exports = (sequelize, DataTypes) => {
  class Grupo extends Model {
    static associate(models) {
      this.belongsToMany(models.Usuario, {
        through: models.GrupoUsuario,
        foreignKey: 'id_grupo',
        otherKey: 'id_usuario',
        as: 'usuarios'
      });
      this.hasMany(models.Gasto, {
        foreignKey: 'id_grupo',
        as: 'gastos'
      });
      this.hasMany(models.Tag, {
        foreignKey: 'id_grupo',
        as: 'tags'
      });
    }
  }

  Grupo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      limite_gasto: {
        type: DataTypes.DECIMAL(12, 2),
      },
      monto_gastado: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      color: {
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => crypto.randomBytes(20).toString('hex')
      }
    },
    {
      sequelize,
      modelName: 'Grupo',
      tableName: 'grupos',
      timestamps: false,
    }
  );

  return Grupo;
};
