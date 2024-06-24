"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Project }) {
      // define association here
    }

    toJSON() {
      return {
        ...this.get(),
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Participants.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "users",
        },
      },
      projectId: {
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "projects",
        },
      },
    },
    {
      sequelize,
      tableName: "participants",
      modelName: "Participants",
    }
  );
  return Participants;
};
