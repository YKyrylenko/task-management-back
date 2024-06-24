const { User } = require("../models");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { name, email, surname, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      surname,
      password,
    });

    res.json(user).status(200);
  } catch (err) {
    res.json(err);
  }
};

const signin = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message || err,
        user: user,
      });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const { iat, password, id, ...rest } = user;
      const token = jwt.sign(rest, "jwtsecret");

      return res.status(200).json({
        token: token,
        user: {
          uuid: user.uuid,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
      });
    });
  })(req, res);
};

module.exports = {
  signin,
  signup,
};
