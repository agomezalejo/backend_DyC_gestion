'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('gastos', 'metodo_pago');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('gastos', 'metodo_pago',{
      type: Sequelize.STRING,
    });
  }
};