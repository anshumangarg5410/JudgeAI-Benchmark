const express = require("express");
const router = express.Router();
const TestCase = require("../models/TestCase");

// POST - Add testcase
router.post("/", async (req, res) => {
  console.log("ROUTE HIT");
  console.log("Incoming body:", req.body);

  // fix #5: validate required fields before saving
  const { category, question, expected } = req.body;

  if (!category || !question || !expected) {
    return res.status(400).json({ error: "category, question, and expected are all required" });
  }

  try {
    const tc = await TestCase.create({ category, question, expected });
    res.json(tc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
});

// GET - Fetch all testcases
router.get("/", async (req, res) => {
  try {
    const testCases = await TestCase.find();
    res.json(testCases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// DELETE - Remove a testcase by id
router.delete("/:id", async (req, res) => {
  try {
    await TestCase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;