require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 3000; // Node on 3000

app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});