const express = require("express");
const app = express();

app.use(express.json());

const testCaseRoutes = require("./routes/testcases");

app.use("/api/testcases", testCaseRoutes);

module.exports = app;