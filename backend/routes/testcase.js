const express = require("express");
const router = express.Router();
const TestCase = require("../models/testcase");
const axios = require("axios"); 


router.get("/", async (req, res) => {
  const data = await TestCase.find();
  res.json(data);
});


router.post("/", async (req, res) => {
  const newCase = new TestCase(req.body);
  await newCase.save();
  res.json(newCase);
});


router.get("/run-eval", async (req, res) => {
  try {
    const testCases = await TestCase.find();

    const response = await axios.post("http://127.0.0.1:5000/run-eval", {
      testCases
    });

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;