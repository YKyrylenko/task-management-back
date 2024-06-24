const { Column, Task, Project, User } = require("../models");

const getColumnsByProjectUuid = async (req, res, next) => {
  const { uuid } = req.params;

  try {
    const project = await Project.findOne({
      where: {
        uuid,
      },
    });

    const columns = await Column.findAll({
      where: {
        projectId: project.dataValues.id,
      },
      include: {
        model: Task,
        as: "tasks",
        required: false,
        include: {
          model: User,
          as: "assignee",
        },
      },
      order: [
        ["order", "ASC"],
        [{ model: Task, as: "tasks" }, "order", "ASC"],
      ],
    });

    res.json(columns);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getColumnsByProjectUuid,
};
