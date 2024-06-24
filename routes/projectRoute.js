const express = require("express");

const router = express.Router();
const projectController = require("../controllers/projectController");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  projectController.getProjects
);
router.get("/:uuid", projectController.getProjectByUuid);
router.post("/", projectController.createProject);

module.exports = router;
