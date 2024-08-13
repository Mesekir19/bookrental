"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "phone", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "phone");
    await queryInterface.removeColumn("Users", "location");
  },
};
