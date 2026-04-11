require("dotenv").config();
const mongoose = require("mongoose");
const Model = require("./models/Model");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hackmania").then(async () => {

    await Model.deleteMany({});
    
    // Add base
    await Model.create({
        id: "gpt-4o",
        name: "GPT-4o Base",
        provider: "OpenAI",
        type: "Base",
        endpoint: "https://api.openai.com/v1",
        apiKeyVar: "OPENAI_API_KEY",
        notes: "Default base model"
    }); 

    // Add FT
    await Model.create({
        id: "gpt-4o-ft",
        name: "GPT-4o Fine-Tuned",
        provider: "OpenAI",
        type: "Fine-Tuned",
        endpoint: "https://api.openai.com/v1",
        apiKeyVar: "OPENAI_API_KEY",
        notes: "Default fine-tuned model"
    });

    console.log("Successfully added 2 default models (Base and Fine-Tuned)!");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
