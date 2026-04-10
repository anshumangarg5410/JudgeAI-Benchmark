const express = require("express");
const router = express.Router();
const runController = require("../controllers/runController");

router.get("/", runController.getRuns);
router.get("/:id", runController.getRunById);
router.post("/", runController.createRun);
router.delete("/:id", runController.deleteRun);

module.exports = router;
