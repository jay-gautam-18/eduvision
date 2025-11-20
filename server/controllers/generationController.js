const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const User = require('../models/User');
const ImageHistory = require('../models/ImageHistory');
const redisClient = require('../config/redis');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate Image with Enhanced Prompt and Educational Fact
// @route   POST /api/generate
// @access  Private
exports.generateImage = async (req, res) => {
    const { prompt, aspectRatio } = req.body;
    const userId = req.user._id;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        // Check User Credits
        const user = await User.findById(userId);
        if (user.credits < 1) {
            return res.status(403).json({ message: 'Insufficient credits' });
        }

        // Step 1: Enhance Prompt using Gemini
        const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const enhancementPrompt = `You are an expert prompt engineer for AI image generation. Rewrite the following prompt to be more descriptive, visual, and artistic. 
    CRITICAL: Output ONLY the enhanced prompt text. Do not provide options, explanations, or labels like "Option 1". 
    Original Prompt: "${prompt}"`;

        let enhancedPrompt = prompt;
        try {
            const result = await textModel.generateContent(enhancementPrompt);
            const response = await result.response;
            enhancedPrompt = response.text().trim();
            // Remove any potential quotes or labels if they still appear
            enhancedPrompt = enhancedPrompt.replace(/^"|"$/g, '').replace(/^(Option \d:|Enhanced Prompt:|Here is).*$/im, '').trim();
        } catch (err) {
            console.error("Gemini Enhancement Failed:", err.message);
        }

        // Step 2: Generate Image using Imagen 4 (via REST API)
        // Switching to 'imagen-4.0-generate-001' as it is available and supports the predict method.
        let imageUrl = 'https://via.placeholder.com/1024x1024?text=Generation+Failed';

        try {
            console.log(`Generating image with Imagen 4 for prompt: ${enhancedPrompt}`);

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
                {
                    instances: [
                        { prompt: enhancedPrompt }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: aspectRatio || "1:1"
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.predictions && response.data.predictions[0]) {
                const base64Image = response.data.predictions[0].bytesBase64Encoded;
                imageUrl = `data:image/png;base64,${base64Image}`;
            } else {
                console.warn("Imagen 4 response format unexpected:", response.data);
                throw new Error("Invalid response from Imagen 4 API");
            }

        } catch (err) {
            console.error("Imagen 4 Generation Failed:", err.response ? err.response.data : err.message);

            // Fallback to SVG Data URI to avoid network errors (ERR_NAME_NOT_RESOLVED)
            const errorText = `Generation Failed: ${err.message.substring(0, 30)}...`;
            const svg = `
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#2d2d2d"/>
          <text x="50%" y="50%" font-family="Arial" font-size="40" fill="#ff5555" text-anchor="middle" dy="-20">Image Generation Failed</text>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#aaaaaa" text-anchor="middle" dy="30">${errorText}</text>
        </svg>
      `;
            imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        }

        // Step 3: Generate Educational Fact using Gemini
        const factPrompt = `Generate a short, interesting educational fact or description (max 2 sentences) related to this concept: "${prompt}".`;
        let educationalFact = "Did you know? Learning is a continuous process!";

        try {
            const factResult = await textModel.generateContent(factPrompt);
            const factResponse = await factResult.response;
            educationalFact = factResponse.text().trim();
        } catch (err) {
            console.error("Gemini Fact Generation Failed:", err.message);
        }

        // Save to History
        const newImage = await ImageHistory.create({
            user: userId,
            originalPrompt: prompt,
            enhancedPrompt,
            imageUrl,
            aspectRatio,
            educationalFact
        });

        // Update User Credits and XP
        user.credits -= 1;
        user.xp += 10;
        await user.save();

        // Invalidate Gallery Cache
        await redisClient.del('gallery_images');

        res.status(200).json({
            image: newImage,
            user: { credits: user.credits, xp: user.xp }
        });

    } catch (error) {
        console.error("Generation Controller Error:", error);
        res.status(500).json({ message: 'Generation failed', error: error.message, stack: error.stack });
    }
};
