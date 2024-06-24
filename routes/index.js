const projectRoute = require("./projectRoute");
const userRoute = require("./userRoute");
const taskRoute = require("./taskRoute");
const columnRoute = require("./columnRoute");
const authRoute = require("./authRoute");

module.exports = (app) => {
  app.use("/projects", projectRoute);
  app.use("/users", userRoute);
  app.use("/tasks", taskRoute);
  app.use("/columns", columnRoute);
  app.use("/auth", authRoute);
};
