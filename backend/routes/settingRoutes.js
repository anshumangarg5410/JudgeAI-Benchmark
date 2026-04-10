const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");

router.get("/1", settingController.getSetting);
router.put("/1", settingController.updateSetting);

module.exports = router;
