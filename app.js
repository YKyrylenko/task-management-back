const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
const errorHandler = require("./middlewares/errorMiddleware");
require("./middlewares/passport");
app.use(express.json());
app.use(cors());
app.use(errorHandler);

require("./routes")(app);

app.listen(8080, () => {
  sequelize.authenticate();
});
