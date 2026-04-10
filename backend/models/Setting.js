const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  singletonId: { type: Number, default: 1, unique: true },
  backendUrl: { type: String },
  authToken: { type: String },
  evalEndpoint: { type: String },
  modelsEndpoint: { type: String },
  regressionThreshold: { type: Number },
  latencyWarning: { type: Number },
  errorSpikeThreshold: { type: Number },
  defaultScorer: { type: String },
  judgeModel: { type: String },
  evalLanguage: { type: String },
  asyncBatch: { type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);
