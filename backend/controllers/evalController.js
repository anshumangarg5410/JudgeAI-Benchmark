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

    // 3. Reshape results to match frontend expectations
    // Flask returns { base: { summary, details }, fine: { summary, details } }
    // Frontend expects { base: summary, fine: summary, baseDetails: details, fineDetails: details }
    const reshapedResults = {
      base: evalResults.base.summary,
      fine: evalResults.fine.summary,
      baseDetails: evalResults.base.details,
      fineDetails: evalResults.fine.details
    };

    // 4. Return the rich results
    res.json(reshapedResults);

  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to run evaluation" });
  }
};
