'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastos_fijos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      frecuencia: {
          type: Sequelize.STRING,
          allowNull: false
      },
      proxima_fecha: {
          type: Sequelize.DATE,
          allowNull: false
      },
      agendado: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gastos_fijos');
  }
};
