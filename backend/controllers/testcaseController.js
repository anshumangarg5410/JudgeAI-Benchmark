const TestCase = require("../models/TestCase");

exports.getTestcases = async (req, res) => {
  try {
    const testCases = await TestCase.find();
    res.json(testCases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch test cases" });
  }
};

exports.createTestcase = async (req, res) => {
  const { category, question, expected } = req.body;
  if (!category || !question || !expected) {
    return res.status(400).json({ error: "category, question, and expected are all required" });
  }

  try {
    const tc = await TestCase.create({ category, question, expected });
    res.json(tc);
  } catch (err) {
    res.status(500).json({ error: "Failed to save testcase" });
  }
};

exports.deleteTestcase = async (req, res) => {
  try {
    await TestCase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete testcase" });
  }
};
