"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Column, Project, User, Action }) {
      // define association here
      this.belongsTo(Column, {
        foreignKey: "columnId",
      });
      this.belongsTo(Project, {
        foreignKey: "projectId",
      });
      this.belongsTo(User, {
        foreignKey: "assignedAt",
        as: "assignee",
      });
      this.hasMany(Action, {
        foreignKey: "taskId",
        as: "actions",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }
  Task.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    },
    {
      sequelize,
      tableName: "tasks",
      modelName: "Task",
      hooks: {
        beforeCreate: async (task) => {
          const project = await sequelize.models.Project.findOne({
            where: {
              id: task.projectId,
            },
          });
          const maxOrderTask = await Task.findOne({
            attributes: [
              [sequelize.fn("MAX", sequelize.col("order")), "maxOrder"],
            ],
            where: {
              columnId: task.columnId,
              projectId: task.projectId,
            },
          });
          task.order =
            maxOrderTask && maxOrderTask.dataValues.maxOrder != null
              ? maxOrderTask.dataValues.maxOrder + 1
              : 1;
          task.projectUuid = project.dataValues.uuid;
        },
        afterCreate: async (task) => {
          const project = await sequelize.models.Project.findOne({
            where: {
              id: task.projectId,
            },
          });
          const number = `${project.dataValues.taskPrefix}-${task.id}`;
          task.number = number;
          await task.save();
        },
      },
    }
  );

  Task.createTask = async function (data) {
    return await this.create(data);
  };

  // Task.getTaskInfo = async function (uuid) {
  //   return await this.findOne({
  //     where: {
  //       uuid,
  //     },
  //     include: [
  //       {
  //         model: User,
  //         as: "assignee",
  //       },
  //       {
  //         model: Action,
  //         as: "actions",
  //         include: [
  //           {
  //             model: User,
  //             as: "createdBy",
  //             attributes: ["name", "surname"],
  //           },
  //           {
  //             model: User,
  //             as: "assignee",
  //             attributes: ["name", "surname", "uuid"],
  //           },
  //           {
  //             model: User,
  //             as: "prevAssignee",
  //             attributes: ["name", "surname"],
  //           },
  //           {
  //             model: Column,
  //             as: "prevColumn",
  //             attributes: ["name"],
  //           },
  //           {
  //             model: Column,
  //             as: "currentColumn",
  //             attributes: ["name"],
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // };
  return Task;
};
