"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      columnId: {
        type: DataTypes.INTEGER,
      },
      assignedAt: {
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.INTEGER,
      },
      projectUuid: {
        type: DataTypes.UUID,
      },
      number: {
        type: DataTypes.STRING,
      },
      estimatedTime: {
        type: DataTypes.INTEGER,
      },
      loggedTime: {
        type: DataTypes.INTEGER,
      },
      priority: {
        type: DataTypes.ENUM,
        values: ["CLEAR", "LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tasks");
  },
};
