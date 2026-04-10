const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Import Routes
const testCaseRoutes = require("./routes/testcase");
const userRoutes = require("./routes/userRoutes");
const modelRoutes = require("./routes/modelRoutes");
const runRoutes = require("./routes/runRoutes");
const settingRoutes = require("./routes/settingRoutes");
const evaluateRoutes = require("./routes/evaluateRoutes");

// Mount Routes
app.use("/api/testcases", testCaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/evaluate", evaluateRoutes);

module.exports = app;