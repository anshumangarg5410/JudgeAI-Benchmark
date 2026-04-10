require("dotenv").config();
const mongoose = require("mongoose");
const TestCase = require("./models/TestCase");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hackmania").then(async () => {
    const count = await TestCase.countDocuments();
    if (count === 0) {
      await TestCase.insertMany([
        { category: "Math", question: "Solve: 2 + 2", expected: "4" },
        { category: "Math", question: "If I have 5 apples and eat 2, how many are left?", expected: "3" },
        { category: "Coding", question: "Write a function to return Hello World", expected: "Hello World" },
        { category: "Coding", question: "What is the Big O of binary search?", expected: "O(log n)" },
        { category: "Reasoning", question: "All roses are flowers. Some flowers fade. Can roses fade?", expected: "Yes" },
        { category: "Reasoning", question: "If today is Tuesday, what is 4 days from now?", expected: "Saturday" },
        { category: "General", question: "Explain entropy.", expected: "disorder" },
        { category: "General", question: "What is the capital of France?", expected: "Paris" }
      ]);
      console.log("8 Default test cases successfully inserted!");
    } else {
      console.log(`Test cases already exist (${count}). Done.`);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
