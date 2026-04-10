const Run = require("../models/Run");

exports.getRuns = async (req, res) => {
  try {
    const runs = await Run.find();
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch runs" });
  }
};

exports.getRunById = async (req, res) => {
  try {
    const run = await Run.findById(req.params.id);
    if (!run) return res.status(404).json({ error: "Run not found" });
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch run" });
  }
};

exports.createRun = async (req, res) => {
  try {
    const run = await Run.create(req.body);
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: "Failed to create run" });
  }
};

exports.deleteRun = async (req, res) => {
  try {
    await Run.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete run" });
  }
};
