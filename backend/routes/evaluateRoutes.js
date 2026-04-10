const express = require("express");
const router = express.Router();
const evalController = require("../controllers/evalController");

router.post("/", evalController.runEvaluation);

module.exports = router;
