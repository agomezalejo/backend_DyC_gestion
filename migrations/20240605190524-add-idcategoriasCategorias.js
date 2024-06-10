'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('gastos', 'id_categoria', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('gastos', 'id_categoria');
  }
};
