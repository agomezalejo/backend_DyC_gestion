'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('grupos_usuarios', 'balance', {
      type: Sequelize.DECIMAL(12, 2),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('grupos_usuarios', 'balance');
  }
};
