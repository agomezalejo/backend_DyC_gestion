'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Gasto extends Model {
    static associate(models) {
      this.belongsToMany(models.Usuario, {
        through: models.GastoUsuario,
        foreignKey: 'id_gasto',
        otherKey: 'id_usuario',
        as: 'usuarios'
      });

      this.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      this.hasOne(models.GastoFijo, {
        foreignKey: 'id_gasto',
        as: 'gastoFijo'
      });

      this.belongsToMany(models.Tag, {
        through: models.GastoTag,
        foreignKey: 'id_gasto',
        otherKey: 'id_tag',
        as: 'tags'
      });

      this.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });
    }
  }

  Gasto.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      monto_pagado: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          validaMontoPagado(value) {
            if (value > this.monto) {
              throw new Error('El monto pagado no puede ser mayor al monto total');
            }
          }
        }
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['CASUAL', 'FIJO']]
        }
      },
      liquidacion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['PENDIENTE', 'PAGADO']]
        }
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
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
      modelName: 'Gasto',
      tableName: 'gastos',
      timestamps: false,
    }
  );

  return Gasto;
};
