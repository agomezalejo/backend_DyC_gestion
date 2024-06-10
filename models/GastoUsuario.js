'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GastoUsuario extends Model {}

  GastoUsuario.init(
    {
      id_gasto: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'gastos',
          key: 'id'
        },
        primaryKey: true
      },
      id_usuario: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        primaryKey: true
      },
      monto_pagado: {
        type: DataTypes.DECIMAL(12, 2),
      },
      metodo_pago: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: [['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'BILLETERA VIRTUAL', 'OTRO']]
        }
      }
    },
    {
      sequelize,
      modelName: 'GastoUsuario',
      tableName: 'gastos_usuarios',
      timestamps: false,
    }
  );

  return GastoUsuario;
};
