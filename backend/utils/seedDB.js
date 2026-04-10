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
    console.log("Starting database seeding process...");

    let mockData;
    const mockDataFile = path.join(__dirname, "../../frontend/db.json");
    
    if (fs.existsSync(mockDataFile)) {
      console.log("Reading seed data from db.json...");
      mockData = JSON.parse(fs.readFileSync(mockDataFile, "utf-8"));
    } else {
      console.log("No db.json found, using internal defaults for seeding...");
      mockData = {
        users: [{ email: "admin@hackmania.io", password: "password123", name: "Admin User", role: "admin" }],
        models: [
          { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", type: "base", endpoint: "https://api.openai.com/v1", apiKeyVar: "OPENAI_API_KEY" },
          { id: "gpt-4o-ft", name: "GPT-4o Fine-tuned", provider: "OpenAI", type: "fine-tuned", endpoint: "https://api.openai.com/v1", apiKeyVar: "OPENAI_API_KEY" }
        ],
        settings: [{ singletonId: 1, backendUrl: "http://localhost:8000", regressionThreshold: 0.05, latencyWarning: 2000 }]
      };
    }

    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0 && mockData.users && mockData.users.length) {
      await User.insertMany(mockData.users.map(u => ({
        email: u.email, password: u.password, name: u.name, role: u.role
      })));
      console.log(`Seeded ${mockData.users.length} users.`);
    } else {
      console.log("Users already exist or no user data provided, skipping.");
    }

    // Seed Models
    const modelCount = await Model.countDocuments();
    if (modelCount === 0 && mockData.models && mockData.models.length) {
      await Model.insertMany(mockData.models.map(m => ({
        id: String(m.id), name: m.name, provider: m.provider, type: m.type,
        endpoint: m.endpoint, apiKeyVar: m.apiKeyVar, notes: m.notes
      })));
      console.log(`Seeded ${mockData.models.length} models.`);
    } else {
      console.log("Models already exist or no model data provided, skipping.");
    }

    // Seed Runs
    const runCount = await Run.countDocuments();
    if (runCount === 0 && mockData.runs && mockData.runs.length) {
      await Run.insertMany(mockData.runs.map(r => ({
        time: r.time, base: r.base, ft: r.ft, categories: r.categories,
        mode: r.mode, tests: r.tests, regressions: r.regressions, avgDelta: r.avgDelta
      })));
      console.log(`Seeded ${mockData.runs.length} runs.`);
    }

    // Seed Settings
    const existingSetting = await Setting.findOne({ singletonId: 1 });
    if ((!existingSetting || !existingSetting.backendUrl) && mockData.settings && mockData.settings.length) {
      const s = mockData.settings[0];
      await Setting.findOneAndUpdate(
        { singletonId: 1 },
        { 
          singletonId: 1, 
          backendUrl: s.backendUrl, authToken: s.authToken, evalEndpoint: s.evalEndpoint,
          modelsEndpoint: s.modelsEndpoint, regressionThreshold: s.regressionThreshold,
          latencyWarning: s.latencyWarning, errorSpikeThreshold: s.errorSpikeThreshold,
          defaultScorer: s.defaultScorer, judgeModel: s.judgeModel, evalLanguage: s.evalLanguage,
          asyncBatch: s.asyncBatch
        },
        { upsert: true, new: true }
      );
      console.log(`Updated system settings.`);
    }

    // Seed TestCases
    const tcCount = await TestCase.countDocuments();
    if (tcCount === 0) {
      await TestCase.insertMany([
        { category: "Math", question: "Solve: 2 + 2", expected: "4" },
        { category: "Coding", question: "Write a function to return Hello World", expected: "def hello(): return 'Hello World'" },
        { category: "Reasoning", question: "All roses are flowers. Some flowers fade. Can roses fade?", expected: "Yes" },
        { category: "General", question: "Explain entropy.", expected: "A measure of disorder" }
      ]);
      console.log("Seeded default test cases.");
    }

    console.log("Database seeding process completed.");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
};

module.exports = seedDB;
