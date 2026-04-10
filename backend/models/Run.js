const mongoose = require("mongoose");

const runSchema = new mongoose.Schema({
  time: { type: String },
  base: { type: String },
  ft: { type: String },
  categories: { type: String },
  mode: { type: String },
  tests: { type: Number },
  regressions: { type: Number },
  avgDelta: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Run", runSchema);
