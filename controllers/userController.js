const { User } = require("../models");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (err) {
    res.send(500).json(err);
  }
};

const createUser = async (req, res) => {
  const { name, email, surname, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      surname,
      password,
    });

    res.json(user);
  } catch (err) {
    res.send(500).json(err);
  }
};

module.exports = {
  getUsers,
  createUser,
};
