const Model = require("../models/Model");

exports.getModels = async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
};

exports.getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find by the custom `id` field usually
    let model = await Model.findOne({ id: id });
    if (!model) {
        model = await Model.findById(id); // fallback
    }
    if (!model) return res.status(404).json({ error: "Model not found" });
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch model" });
  }
};

exports.createModel = async (req, res) => {
  try {
    const model = await Model.create(req.body);
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: "Failed to create model" });
  }
};

exports.updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    let model = await Model.findOneAndUpdate({ id: id }, req.body, { new: true });
    if (!model) {
       model = await Model.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: "Failed to update model" });
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    let model = await Model.findOneAndDelete({ id: id });
    if (!model) {
      model = await Model.findByIdAndDelete(id);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete model" });
  }
};
