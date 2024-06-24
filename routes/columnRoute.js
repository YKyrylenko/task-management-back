const express = require("express");

const router = express.Router();
const columnController = require("../controllers/columnController");

router.get("/:uuid", columnController.getColumnsByProjectUuid);

module.exports = router;
