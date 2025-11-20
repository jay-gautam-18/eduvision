const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: './.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        let output = "Available Models:\n";
        const models = response.data.models;
        models.forEach(model => {
            output += `- ${model.name}\n`;
            output += `  Methods: ${model.supportedGenerationMethods.join(', ')}\n`;
        });

        fs.writeFileSync('models.txt', output);
        console.log("Models written to models.txt");
    } catch (error) {
        console.error("Error listing models:", error.response ? error.response.data : error.message);
    }
}

listModels();
