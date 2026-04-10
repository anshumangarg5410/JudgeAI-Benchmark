const express = require("express");
const router = express.Router();
const axios = require("axios");
const TestCase = require("../models/testcase");


router.post("/", async (req, res) => {
  const tc = await TestCase.create(req.body);
  res.json(tc);
});


router.get("/", async (req, res) => {
  const testCases = await TestCase.find();
  res.json(testCases);
});


router.get("/run-eval", async (req, res) => {
  try {
    const testCases = await TestCase.find();

    const response = await axios.post("http://127.0.0.1:5001/run-eval", {
      testCases
    });

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;