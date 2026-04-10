const Setting = require("../models/Setting");

exports.getSetting = async (req, res) => {
  try {
    let setting = await Setting.findOne({ singletonId: 1 });
    if (!setting) {
      setting = await Setting.create({ singletonId: 1 }); // Create default if missing
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch setting" });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { singletonId: 1 },
      req.body,
      { new: true, upsert: true } // upsert ensures it creates if doesn't exist
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
};
