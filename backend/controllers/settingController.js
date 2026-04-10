const Setting = require("../models/Setting");

exports.getSetting = async (req, res) => {
  try {
    let setting = await Setting.findOne({ singletonId: 1 });
    if (!setting) {
      setting = await Setting.create({ singletonId: 1 }); 
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
      { new: true, upsert: true } 
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
};
