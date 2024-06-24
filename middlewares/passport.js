const { User } = require("../models");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
  secretOrKey: "jwtsecret",
};
passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      const isValid = await user.isValidPassword(password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      } else {
        return done(null, user.dataValues);
      }
    } catch (err) {
      return done(null, false, { message: "Incorrect email." });
    }
  })
);

passport.use(
  new JwtStrategy(jwtOptions, async ({ email }, done) => {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
