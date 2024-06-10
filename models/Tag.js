'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      this.belongsToMany(models.Gasto, {
        through: models.GastoTag,
        foreignKey: 'id_tag',
        otherKey: 'id_gasto',
        as: 'gastos'
      });

      this.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      this.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });
    }
  }

  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios', 
          key: 'id'
        }
      },
      id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'grupos', 
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'tags',
      timestamps: false
    }
  );

  return Tag;
};
