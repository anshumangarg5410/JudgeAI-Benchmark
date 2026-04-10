require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

const PORT = process.env.PORT || 3000; // Node on 3000

app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});