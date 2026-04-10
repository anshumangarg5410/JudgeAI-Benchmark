const express = require("express");
const cors = require("cors");        // fix #6: added CORS
const app = express();

app.use(cors());                     // fix #6: allow frontend requests
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

const testCaseRoutes = require("./routes/testcase");
app.use("/api/testcases", testCaseRoutes);

module.exports = app;