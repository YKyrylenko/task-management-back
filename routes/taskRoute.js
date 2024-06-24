const express = require("express");
const passport = require("passport");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  taskController.createTask
);
router.get("/:uuid", taskController.getTaskByUuid);
router.put(
  "/:uuid",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTaskOrder
);

router.put(
  "/edit/:uuid",
  passport.authenticate("jwt", { session: false }),
  taskController.updateTask
);

module.exports = router;
