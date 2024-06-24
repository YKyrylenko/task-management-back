"use strict";
const { Model } = require("sequelize");
const { User } = require("../models");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Column, Task }) {
      // define association here
      this.belongsToMany(User, {
        foreignKey: "projectId",
        as: "participant",
        through: "participants",
      });

      this.hasMany(Column, {
        foreignKey: "projectId",
        as: "columns",
      });

      this.hasMany(Task, {
        foreignKey: "projectId",
        as: "projectTasks",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        // creatorId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }

  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1],
            msg: "Name is required",
          },
        },
      },
      description: { type: DataTypes.STRING, allowNull: false },
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      creatorUuid: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      taskPrefix: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "projects",
      modelName: "Project",
      hooks: {
        beforeCreate: async (project) => {
          const creator = await sequelize.models.User.findOne({
            where: {
              id: project.creatorId,
            },
          });

          project.creatorUuid = creator.dataValues.uuid;
        },
      },
    }
  );

  return Project;
};
