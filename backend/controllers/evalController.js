const TestCase = require("../models/TestCase");
const evalService = require("../services/evalService");

exports.runEvaluation = async (req, res) => {
  const { baseModel, ftModel, categories, mode } = req.body;
  
  try {
    // 1. Fetch test cases from MongoDB matching the requested categories
    const testCases = await TestCase.find({ category: { $in: categories } });
    
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: "No test cases found for selected categories." });
    }

    // 2. Call the Python Flask microservice to evaluate
    const evalResults = await evalService.evaluateTestCases(testCases, mode);

    // 3. Return the rich results
    res.json(evalResults);

  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to run evaluation" });
  }
};
