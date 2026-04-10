const TestCase = require("../models/TestCase");
const Model = require("../models/Model");
const evalService = require("../services/evalService");

exports.runEvaluation = async (req, res) => {
  const { baseId, ftId, categories, mode } = req.body;
  
  try {
    // 1. Fetch Model Instructions (Notes) from Registry
    const baseModelRecord = await Model.findOne({ id: baseId });
    const ftModelRecord = await Model.findOne({ id: ftId });

    const baseInstructions = baseModelRecord?.notes || "";
    const ftInstructions = ftModelRecord?.notes || "";

    // 2. Limit test cases per category for faster evaluation
    const testCases = [];
    for (const cat of categories) {
      const cases = await TestCase.find({ category: cat }).limit(2);
      testCases.push(...cases);
    }
    
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: "No test cases found for selected categories." });
    }

    // 3. Pass Instructions to the AI Engine
    const evalResults = await evalService.evaluateTestCases(
        testCases, 
        mode,
        baseInstructions,
        ftInstructions
    );

    const reshapedResults = {
      base: evalResults.base.summary,
      fine: evalResults.fine.summary,
      baseDetails: evalResults.base.details,
      fineDetails: evalResults.fine.details
    };

    res.json(reshapedResults);

  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Failed to run evaluation" });
  }
};
