const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const Model = require("../models/Model");
const Run = require("../models/Run");
const Setting = require("../models/Setting");
const TestCase = require("../models/TestCase");

const seedDB = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already seeded, skipping seed DB.");
      return;
    }

    console.log("Seeding Database from db.json...");

    // Default db.json payload representation to populate MongoDB
    // We could read from frontend db.json but it's getting deleted, so we provide defaults or read before deletion.
    const mockDataFile = path.join(__dirname, "../../frontend/db.json");
    if (!fs.existsSync(mockDataFile)) {
      console.log("No db.json found fallback seeding not possible");
      return;
    }
    
    const mockData = JSON.parse(fs.readFileSync(mockDataFile, "utf-8"));
    
    // Convert numerical IDs to Number if needed, schema mostly uses Strings or specific fields
    if (mockData.users && mockData.users.length) {
      await User.insertMany(mockData.users.map(u => ({
        email: u.email, password: u.password, name: u.name, role: u.role
      })));
    }

    if (mockData.models && mockData.models.length) {
      await Model.insertMany(mockData.models.map(m => ({
        id: String(m.id), name: m.name, provider: m.provider, type: m.type,
        endpoint: m.endpoint, apiKeyVar: m.apiKeyVar, notes: m.notes
      })));
    }

    if (mockData.runs && mockData.runs.length) {
      await Run.insertMany(mockData.runs.map(r => ({
        time: r.time, base: r.base, ft: r.ft, categories: r.categories,
        mode: r.mode, tests: r.tests, regressions: r.regressions, avgDelta: r.avgDelta
      })));
    }

    if (mockData.settings && mockData.settings.length) {
      await Setting.insertMany(mockData.settings.map(s => ({
        singletonId: 1, 
        backendUrl: s.backendUrl, authToken: s.authToken, evalEndpoint: s.evalEndpoint,
        modelsEndpoint: s.modelsEndpoint, regressionThreshold: s.regressionThreshold,
        latencyWarning: s.latencyWarning, errorSpikeThreshold: s.errorSpikeThreshold,
        defaultScorer: s.defaultScorer, judgeModel: s.judgeModel, evalLanguage: s.evalLanguage,
        asyncBatch: s.asyncBatch
      })));
    }
    
    // Add real mock test cases if none exist
    const tcCount = await TestCase.countDocuments();
    if (tcCount === 0) {
      await TestCase.insertMany([
        { category: "Math", question: "Solve: 2 + 2", expected: "4" },
        { category: "Coding", question: "Write a function to return Hello World", expected: "def hello(): return 'Hello World'" },
        { category: "Reasoning", question: "All roses are flowers. Some flowers fade. Can roses fade?", expected: "Yes" },
        { category: "General", question: "Explain entropy.", expected: "A measure of disorder" }
      ]);
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDB;
