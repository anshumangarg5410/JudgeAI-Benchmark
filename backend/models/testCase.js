const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  expected: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  evaluationCriteria: [{ type: String }]
});

module.exports = mongoose.model("TestCase", testCaseSchema);