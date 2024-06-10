'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      this.belongsToMany(models.Gasto, {
        through: models.GastoUsuario,
        foreignKey: 'id_usuario',
        otherKey: 'id_gasto',
        as: 'gastos'
      });

      this.hasMany(models.Tag, {
        foreignKey: 'id_usuario',
        as: 'tags'
      });

      this.belongsToMany(models.Grupo, {
        through: models.GrupoUsuario,
        foreignKey: 'id_usuario',
        otherKey: 'id_grupo',
        as: 'grupos'
      });
    }
  }

  Usuario.init({
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
    },
    saldo: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
  });

  return Usuario;
};
