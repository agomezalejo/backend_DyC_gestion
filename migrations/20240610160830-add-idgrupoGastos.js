'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('gastos', 'id_grupo', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'grupos', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('gastos', 'id_grupo');
  }
};
