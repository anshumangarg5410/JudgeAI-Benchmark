const express = require("express");
const router = express.Router();
const testcaseController = require("../controllers/testcaseController");

router.get("/", testcaseController.getTestcases);
router.post("/", testcaseController.createTestcase);
router.put("/:id", testcaseController.updateTestcase);
router.delete("/:id", testcaseController.deleteTestcase);
router.post("/generate", testcaseController.generateTestcases);

module.exports = router;