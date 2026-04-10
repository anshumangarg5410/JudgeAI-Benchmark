const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  category: String,
  question: String,
  expected: String
});

module.exports = mongoose.model("TestCase", testCaseSchema);