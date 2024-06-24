"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Actions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Column }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: "userId",
        as: "createdBy",
      });
      this.belongsTo(User, {
        foreignKey: "assigneeId",
        as: "assignee",
      });
      this.belongsTo(User, {
        foreignKey: "prevAssigneeId",
        as: "prevAssignee",
      });
      this.belongsTo(Column, {
        foreignKey: "prevColumnId",
        as: "prevColumn",
      });

      this.belongsTo(Column, {
        foreignKey: "currentColumnId",
        as: "currentColumn",
      });
    }
  }
  Actions.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["CREATE", "CHANGE_STATUS", "LOG_TIME", "ASSIGN_AT"],
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "actions",
      modelName: "Action",
    }
  );
  return Actions;
};
