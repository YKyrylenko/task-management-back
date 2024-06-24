const { Task, Column, Project, User, Action } = require("../models");
const { Sequelize, Model, where } = require("sequelize");

const getTaskInfo = async (uuid) => {
  const task = await Task.findOne({
    where: {
      uuid,
    },
    include: [
      {
        model: User,
        as: "assignee",
      },
      {
        model: Action,
        as: "actions",
        include: [
          {
            model: User,
            as: "createdBy",
            attributes: ["name", "surname"],
          },
          {
            model: User,
            as: "assignee",
            attributes: ["name", "surname", "uuid"],
          },
          {
            model: User,
            as: "prevAssignee",
            attributes: ["name", "surname"],
          },
          {
            model: Column,
            as: "prevColumn",
            attributes: ["name"],
          },
          {
            model: Column,
            as: "currentColumn",
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  return task;
};

const createTask = async (req, res, next) => {
  const { user } = req;
  const {
    name,
    description,
    assignedAt,
    estimatedTime,
    priority,
    columnUuid,
    projectUuid,
  } = req.body;

  try {
    const performer = await User.findOne({
      where: {
        uuid: assignedAt,
      },
    });

    const project = await Project.findOne({
      where: {
        uuid: projectUuid,
      },
    });

    const column = await Column.findOne({
      where: {
        uuid: columnUuid,
      },
    });

    const task = await Task.createTask({
      name,
      description,
      assignedAt: performer.dataValues.id,
      estimatedTime,
      priority,
      columnId: column.dataValues.id,
      projectId: project.dataValues.id,
    });

    // const action = await Action.create({
    //   type: "CREATE",
    //   taskId: task.dataValues.id,
    //   userId: user.dataValues.id,
    // });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const updateTaskOrder = async (req, res, next) => {
  const user = req.user;
  const { uuid } = req.params;
  const { projectUuid, columnUuid, order } = req.body;

  try {
    const item = await Task.findOne({
      where: {
        uuid,
      },
    });

    const project = await Project.findOne({
      where: {
        uuid: projectUuid,
      },
    });

    const column = await Column.findOne({
      where: {
        uuid: columnUuid,
      },
    });

    const sameColumn = column.dataValues.id === item.dataValues.columnId;

    const oldOrder = item.order;

    item.order = order;
    await item.save();

    if (sameColumn && order < oldOrder) {
      await Task.increment(
        { order: 1 },
        {
          where: {
            columnId: column.dataValues.id,
            uuid: {
              [Sequelize.Op.ne]: uuid,
            },
            order: {
              [Sequelize.Op.gte]: order,
              [Sequelize.Op.lt]: oldOrder,
            },
          },
        }
      );
    } else if (sameColumn && order > oldOrder) {
      await Task.decrement(
        {
          order: 1,
        },
        {
          where: {
            columnId: column.dataValues.id,
            uuid: {
              [Sequelize.Op.ne]: uuid,
            },
            order: {
              [Sequelize.Op.gt]: oldOrder,
              [Sequelize.Op.lte]: order,
            },
          },
        }
      );
    } else if (!sameColumn) {
      const prevColumn = await Column.findOne({
        where: {
          id: item.columnId,
        },
      });

      const prevColumnId = prevColumn.dataValues.id;

      await Action.create({
        type: "CHANGE_STATUS",
        taskId: item.dataValues.id,
        userId: user.dataValues.id,
        prevColumnId: prevColumnId,
        currentColumnId: column.dataValues.id,
        assigneeId: item.dataValues.assignedAt,
      });

      await Task.update(
        { columnId: column.dataValues.id },
        {
          where: {
            uuid: uuid,
          },
        }
      );

      await Task.decrement(
        {
          order: 1,
        },
        {
          where: {
            columnId: item.dataValues.columnId,
            order: {
              [Sequelize.Op.gt]: oldOrder,
            },
          },
        }
      );

      await Task.increment(
        { order: 1 },
        {
          where: {
            columnId: column.dataValues.id,
            uuid: {
              [Sequelize.Op.ne]: uuid,
            },
            order: {
              [Sequelize.Op.gte]: order,
            },
          },
        }
      );
    }
    res.json(item);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getTaskByUuid = async (req, res, next) => {
  const { uuid } = req.params;
  try {
    const task = await getTaskInfo(uuid);

    res.json(task);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  const { uuid } = req.params;
  const { assignedAt } = req.body;

  try {
    const user = await User.findOne({
      where: {
        uuid: assignedAt,
      },
    });

    await Task.update(
      {
        assignedAt: user.dataValues.id,
      },
      {
        where: { uuid },
      }
    );

    const task = await getTaskInfo(uuid);

    res.json(task);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createTask,
  updateTaskOrder,
  getTaskByUuid,
  updateTask,
};
