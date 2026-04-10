require("dotenv").config();
const connectDB = require("./config/db");
const seedDB = require("./utils/seedDB");
const app = require("./app");

const startServer = async () => {
  await connectDB();
  await seedDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Node server running on port ${PORT}`);
  });
};

startServer();