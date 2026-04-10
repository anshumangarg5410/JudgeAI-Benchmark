const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  type: { type: String, required: true }, 
  endpoint: { type: String },
  apiKeyVar: { type: String },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Model", modelSchema);
