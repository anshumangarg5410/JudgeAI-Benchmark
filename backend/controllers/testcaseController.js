const TestCase = require("../models/TestCase");
const axios = require("axios");

exports.getTestcases = async (req, res) => {
  try {
    const testCases = await TestCase.find();
    res.json(testCases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch test cases" });
  }
};

exports.createTestcase = async (req, res) => {
  try {
    const tc = await TestCase.create(req.body);
    res.json(tc);
  } catch (err) {
    res.status(500).json({ error: "Failed to save testcase" });
  }
};

exports.updateTestcase = async (req, res) => {
  try {
    const tc = await TestCase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tc);
  } catch (err) {
    res.status(500).json({ error: "Failed to update testcase" });
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

exports.generateTestcases = async (req, res) => {
  const { category, count } = req.body;
  const FLASK_URL = process.env.FLASK_URL || "http://localhost:5001";
  
  try {
    const response = await axios.post(`${FLASK_URL}/generate`, { category, count: count || 3 });
    const generatedData = response.data;

    if (Array.isArray(generatedData)) {
      const saved = await TestCase.insertMany(generatedData);
      res.json(saved);
    } else {
      res.status(500).json({ error: "Unexpected AI response format", raw: generatedData });
    }
  } catch (err) {
    console.error("AI Generation failed:", err.message);
    res.status(500).json({ error: "AI Engine failed to generate test cases" });
  }
};
