const express = require("express");
const app = express();

const testcaseRoutes = require("./routes/testcase");

app.use(express.json());

// mount routes
app.use("/api/testcases", testcaseRoutes);

module.exports = app;