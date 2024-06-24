const { Project, User, Column, Task } = require("../models");
const jwt = require("jsonwebtoken");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.send(500).json(err);
  }
};

const createProject = async (req, res, next) => {
  const { name, description, taskPrefix, participantUuids, columns } = req.body;

  try {
    const creator = await User.findOne();

    const participants = await User.findAll({
      where: {
        uuid: participantUuids,
      },
    });

    const project = await Project.create({
      name,
      description,
      creatorId: creator.id,
      taskPrefix,
    });

    const projectColumns = columns.map((column) => ({
      ...column,
      projectId: project.id,
    }));

    await Column.bulkCreate(projectColumns);

    await project.addParticipant(participants);

    const result = await Project.findOne({
      where: {
        id: project.id,
      },
      include: [
        {
          model: User,
          as: "participant",
          through: { attributes: [] },
        },
        {
          model: Column,
          as: "columns",
          attributes: {
            exclude: ["projectId"],
          },
        },
      ],
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getProjectByUuid = async (req, res, next) => {
  const { uuid } = req.params;

  try {
    const project = await Project.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: User,
          as: "participant",
          through: { attributes: [] },
        },
        // {
        //   model: Column,
        //   as: "columns",
        //   attributes: {
        //     exclude: ["projectId"],
        //   },
        //   include: [
        //     {
        //       model: Task,
        //       as: "tasks",
        //       attributes: {
        //         exclude: ["columnId", "projectId"],
        //       },
        //     },
        //   ],
        // },
      ],
      // order: [
      //   [{ model: Column, as: "columns" }, "id", "ASC"],
      //   [
      //     { model: Column, as: "columns" },
      //     { model: Task, as: "tasks" },
      //     "order",
      //     "ASC",
      //   ],
      // ],
    });

    res.json(project);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectByUuid,
};
