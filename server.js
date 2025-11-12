const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store generated content
let generatedContents = [];

// ✅ ADDED: Root route to fix "Cannot GET /"
app.get('/', (req, res) => {
    res.json({
        message: ' AI Content Generator Backend API is running!',
        version: '1.0.0',
        aiProvider: 'Google Gemini',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: 'GET /api/health',
            generate: 'POST /api/generate',
            history: 'GET /api/history'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: '✅ Server is running successfully',
        aiProvider: 'Google Gemini',
        timestamp: new Date().toISOString(),
        message: 'Backend API is working!'
    });
});

// Generate content endpoint
app.post('/api/generate', async (req, res) => {
    try {
        console.log(' Received generation request:', req.body);

        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({
                success: false,
                error: 'Type and data are required'
            });
        }

        // ✅ UPDATED: Try Gemini first, then fallback to mock data
        let generatedContent;
        let aiProvider = 'Mock Data';

        try {
            generatedContent = await generateWithGemini(type, data);
            aiProvider = 'Google Gemini';
            console.log('✅ Content generated with Gemini');
        } catch (geminiError) {
            console.log(' Gemini failed, using mock data:', geminiError.message);
            generatedContent = generateMockContent(type, data);
            aiProvider = 'Mock Data (Gemini Failed)';
        }

        const contentRecord = {
            id: Date.now().toString(),
            type,
            data,
            content: generatedContent,
            timestamp: new Date().toISOString(),
            aiProvider: aiProvider
        };

        generatedContents.push(contentRecord);

        res.json({
            success: true,
            content: generatedContent,
            id: contentRecord.id,
            aiProvider: aiProvider,
            message: `Content generated with ${aiProvider}`
        });

    } catch (error) {
        console.error(' Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content'
        });
    }
});

// ✅ ADDED: Google Gemini API Integration
async function generateWithGemini(type, data) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
    }

    const prompt = generatePrompt(type, data);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
                topP: 0.8,
                topK: 40
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Invalid response from Gemini API');
    }
}

// ✅ ADDED: Generate prompt for Gemini
function generatePrompt(type, data) {
    const prompts = {
        bio: `Create a professional biography for ${data.name || 'a professional individual'}.

Professional Skills: ${data.skills || 'Not specified'}
Key Achievements: ${data.achievements || 'Not specified'}
Tone: ${data.tone || 'professional'}

Write a compelling 150-200 word professional bio that highlights expertise and accomplishments. Make it engaging and suitable for LinkedIn or professional websites.`,

        project: `Create a professional project summary:

Project Title: ${data.title || 'Professional Project'}
Description: ${data.description || 'Not specified'}
Technologies: ${data.technologies || 'Not specified'}
Outcomes: ${data.outcomes || 'Not specified'}

Write a clear, concise 200-250 word project summary that explains the project's purpose, technical approach, and impact. Structure it professionally.`,

        reflection: `Write a thoughtful learning reflection:

Topic: ${data.topic || 'Not specified'}
Experience: ${data.experience || 'Not specified'}
Learnings: ${data.learnings || 'Not specified'}
Applications: ${data.future || 'Not specified'}

Create a 250-300 word reflection that demonstrates deep thinking about the learning experience, personal growth, and future application. Use a reflective yet professional tone.`
    };

    return prompts[type] || "Please provide content details.";
}

// Mock content generator (fallback)
function generateMockContent(type, data) {
    const timestamp = new Date().toLocaleString();

    const mockContents = {
        bio: `PROFESSIONAL BIOGRAPHY\n\n${data.name || 'Professional Individual'} is an expert in ${data.skills || 'their field'} with notable achievements in ${data.achievements || 'their career'}. This professional demonstrates exceptional capability and dedication to excellence.\n\nTheir combination of technical proficiency and strategic thinking makes them a valuable asset in any organization.\n\nGenerated on: ${timestamp}`,

        project: `PROJECT SUMMARY\n\nProject: ${data.title || 'Professional Project'}\n\nDescription: ${data.description || 'This project was designed to achieve specific business objectives through innovative solutions.'}\n\n${data.technologies ? `Technologies: ${data.technologies}\n\n` : ''}${data.outcomes ? `Results: ${data.outcomes}` : 'The project successfully met all objectives and delivered significant value.'}\n\nGenerated on: ${timestamp}`,

        reflection: `LEARNING REFLECTION\n\nTopic: ${data.topic || 'Learning Experience'}\n\nExperience: ${data.experience || 'This learning experience provided valuable insights and skill development opportunities.'}\n\n${data.learnings ? `Key Learnings: ${data.learnings}\n\n` : ''}${data.future ? `Future Applications: ${data.future}` : 'These insights will be valuable for future professional challenges.'}\n\nGenerated on: ${timestamp}`
    };

    return mockContents[type] || "Content generated successfully based on provided information.";
}

// Get history
app.get('/api/history', (req, res) => {
    res.json({
        success: true,
        history: generatedContents.reverse(),
        total: generatedContents.length
    });
});

// ✅ ADDED: Server statistics
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            totalGenerations: generatedContents.length,
            generationsByType: {
                bio: generatedContents.filter(item => item.type === 'bio').length,
                project: generatedContents.filter(item => item.type === 'project').length,
                reflection: generatedContents.filter(item => item.type === 'reflection').length
            },
            serverUptime: process.uptime()
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n ============================================== `);
    console.log(` AI Content Generator Backend Started!`);
    console.log(` AI Provider: Google Gemini`);
    console.log(` Server running on: http://localhost:${PORT}`);
    console.log(` Started at: ${new Date().toLocaleString()}`);
    console.log(` ============================================== \n`);

    console.log(' Available Endpoints:');
    console.log('   ✅ GET  /              - API information');
    console.log('   ✅ GET  /api/health    - Server health check');
    console.log('   ✅ POST /api/generate  - Generate content (Gemini)');
    console.log('   ✅ GET  /api/history   - Generation history');
    console.log('   ✅ GET  /api/stats     - Server statistics\n');

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('  WARNING: Gemini API key not configured!');
        console.log('   Using mock data as fallback');
        console.log('   Get free API key: https://aistudio.google.com/app/apikey');
        console.log('   Add to .env file: GEMINI_API_KEY=your_actual_key_here\n');
    } else {
        console.log(' Gemini API key is configured!');
    }

    console.log(' Test the server: http://localhost:3000');
    console.log(' Health check: http://localhost:3000/api/health\n');
});