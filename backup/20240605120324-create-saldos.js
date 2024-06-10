'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('saldos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      saldo_A: {
        type: Sequelize.DECIMAL(12, 2)
      },
      saldo_B: {
        type: Sequelize.DECIMAL(12, 2)
      },
      id_usuario_A: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      id_usuario_B: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('saldos');
  }
};
