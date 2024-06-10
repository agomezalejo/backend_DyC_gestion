'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tags', 'id_usuario', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tags', 'id_usuario');
  }
};
