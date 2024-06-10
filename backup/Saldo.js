'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Saldo extends Model {}

  Saldo.init(
    {
      nombre: {
        type: DataTypes.STRING,
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      monto: {
        type: DataTypes.DECIMAL(12, 2),
      },
      monto_pagado: {
        type: DataTypes.DECIMAL(12, 2),
      },
      metodo_pago: {
        type: DataTypes.STRING,
      },
      tipo: {
        type: DataTypes.STRING,
      },
      liquidacion: {
        type: DataTypes.STRING,
      },
      fecha: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Saldo',
      tableName: 'saldos',
      timestamps: false,
    }
  );

  return Saldo;
};
