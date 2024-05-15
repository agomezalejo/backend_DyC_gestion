'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: DataTypes.STRING,
      },
      monto: {
        type: DataTypes.DOUBLE,
      },
      fecha: {
        type: DataTypes.DATE,
      },
      categorias: {
        type: DataTypes.STRING,
      },
      tipo: {
        type: DataTypes.STRING,
      },
      metodo_pago: {
        type: DataTypes.STRING,
      },
      nota: {
        type: DataTypes.STRING,
      },
      etiquetas: {
        type: DataTypes.STRING,
      },
      liquidacion: {
        type: DataTypes.BOOLEAN,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gastos');
  }
};
