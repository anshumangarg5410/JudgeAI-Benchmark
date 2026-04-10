const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  expected: { type: String, required: true }
});

module.exports = mongoose.model("TestCase", testCaseSchema);