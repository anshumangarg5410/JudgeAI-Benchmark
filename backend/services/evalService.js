const axios = require("axios");

exports.evaluateTestCases = async (testCases, mode) => {
  const flaskUrl = process.env.FLASK_URL || "http://localhost:5001";
  
  try {
    // Call Flask microservice. Flask expects { "testCases": [...] }
    const response = await axios.post(`${flaskUrl}/run-eval`, { testCases });
    return response.data;
  } catch (error) {
    console.error("Error calling Flask microservice:", error.message);
    throw new Error("Failed to evaluate test cases via microservice");
  }
};
