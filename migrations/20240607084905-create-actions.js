"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("actions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      taskId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      assigneeId: {
        type: DataTypes.INTEGER,
      },
      prevAssigneeId: {
        type: DataTypes.INTEGER,
      },
      prevColumnId: {
        type: DataTypes.INTEGER,
      },
      currentColumnId: {
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["CREATE", "CHANGE_STATUS", "LOG_TIME", "ASSIGN_AT"],
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
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("actions");
  },
};
