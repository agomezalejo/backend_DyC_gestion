'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('gastos_fijos', 'id_gasto', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'gastos', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('gastos_fijos', 'id_gasto');
  }
};
