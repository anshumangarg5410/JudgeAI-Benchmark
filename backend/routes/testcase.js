const express = require("express");
const router = express.Router();
const testcaseController = require("../controllers/testcaseController");

router.get("/", testcaseController.getTestcases);
router.post("/", testcaseController.createTestcase);
router.delete("/:id", testcaseController.deleteTestcase);

module.exports = router;