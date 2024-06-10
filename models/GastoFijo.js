'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GastoFijo extends Model {
    static associate(models) {
      this.belongsTo(models.Gasto, {
        foreignKey: 'id_gasto',
        as: 'gasto'
      });
    }
  }

  GastoFijo.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      frecuencia: {
        type: DataTypes.STRING,
        allowNull: false
      },
      proxima_fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      agendado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      id_gasto: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Gasto',
          key: 'id'
        },
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'GastoFijo',
      tableName: 'gastos_fijos',
      timestamps: false,
    }
  );

  return GastoFijo;
};
