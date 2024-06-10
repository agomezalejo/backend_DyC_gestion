'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GastoTag extends Model {}

  GastoTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_gasto: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_tag: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'GastoTag',
      tableName: 'gastos_tags',
      timestamps: false
    }
  );

  return GastoTag;
};
