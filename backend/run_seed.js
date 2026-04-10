require("dotenv").config();
const connectDB = require("./config/db");
const seedDB = require("./utils/seedDB");

const run = async () => {
    try {
        await connectDB();
        await seedDB();
        console.log("Seed script finished execution.");
        process.exit(0);
    } catch (err) {
        console.error("Seed script failed:", err);
        process.exit(1);
    }
};

run();
