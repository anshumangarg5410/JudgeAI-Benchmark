const axios = require("axios");

exports.evaluateTestCases = async (testCases, mode, baseInstructions, ftInstructions) => {
  const flaskUrl = process.env.FLASK_URL || "http://localhost:5001";
  
  try {
    const response = await axios.post(`${flaskUrl}/run-eval`, { 
        testCases,
        base_instructions: baseInstructions,
        ft_instructions: ftInstructions
    }, { timeout: 600000 });
    return response.data;
  } catch (error) {
    console.error("Error calling Flask microservice:", error.message);
    throw new Error("Failed to evaluate test cases via microservice");
  }
};
