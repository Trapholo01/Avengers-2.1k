// API Configuration
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// State Management
let currentTab = 'bio';
let isGenerating = false;

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-content');
const generateBtn = document.getElementById('generate-btn');
const outputArea = document.getElementById('output-area');
const copyBtn = document.getElementById('copy-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    currentTab = tabName;

    // Update active tab button
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update active form
    forms.forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}-form`);
    });

    // Clear output
    clearOutput();
}

// Generate Content
generateBtn.addEventListener('click', async () => {
    if (isGenerating) return;

    const formData = getFormData();
    if (!validateForm(formData)) {
        showError('Please fill in all required fields.');
        return;
    }

    await generateContent(formData);
});

// Get Form Data
function getFormData() {
    const data = {};

    if (currentTab === 'bio') {
        data.name = document.getElementById('bio-name').value.trim();
        data.skills = document.getElementById('bio-skills').value.trim();
        data.achievements = document.getElementById('bio-achievements').value.trim();
        data.tone = document.getElementById('bio-tone').value;
    } else if (currentTab === 'project') {
        data.title = document.getElementById('project-title').value.trim();
        data.description = document.getElementById('project-description').value.trim();
        data.technologies = document.getElementById('project-technologies').value.trim();
        data.outcomes = document.getElementById('project-outcomes').value.trim();
    } else if (currentTab === 'reflection') {
        data.topic = document.getElementById('reflection-topic').value.trim();
        data.experience = document.getElementById('reflection-experience').value.trim();
        data.learnings = document.getElementById('reflection-learnings').value.trim();
        data.future = document.getElementById('reflection-future').value.trim();
    }

    return data;
}

// Validate Form
function validateForm(data) {
    if (currentTab === 'bio') {
        return data.name && data.skills;
    } else if (currentTab === 'project') {
        return data.title && data.description;
    } else if (currentTab === 'reflection') {
        return data.topic && data.experience;
    }
    return false;
}

// Generate Prompt
function generatePrompt(type, data) {
    const prompts = {
        bio: `Create a professional bio for ${data.name || 'a professional'}.

Skills: ${data.skills || 'Not specified'}
Achievements: ${data.achievements || 'Not specified'}
Tone: ${data.tone}

Write a compelling 150-200 word professional bio that highlights their expertise and accomplishments. Make it engaging and suitable for LinkedIn or a professional website.`,

        project: `Create a professional project summary with the following details:

Project Title: ${data.title || 'Untitled Project'}
Description: ${data.description || 'Not specified'}
Technologies Used: ${data.technologies || 'Not specified'}
Key Outcomes: ${data.outcomes || 'Not specified'}

Write a clear, concise project summary (200-250 words) that explains the project's purpose, technical approach, and impact. Structure it professionally with an overview, technical details, and results.`,

        reflection: `Write a thoughtful learning reflection based on:

Topic/Experience: ${data.topic || 'Not specified'}
What I Did: ${data.experience || 'Not specified'}
Key Learnings: ${data.learnings || 'Not specified'}
Future Applications: ${data.future || 'Not specified'}

Create a 250-300 word reflection that demonstrates deep thinking about the learning experience, personal growth, and future application. Use a reflective yet professional tone.`
    };

    return prompts[type];
}

// Generate Content via API
async function generateContent(formData) {
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Show loading
    outputArea.style.display = 'none';
    loadingSpinner.style.display = 'flex';
    copyBtn.style.display = 'none';

    try {
        const prompt = generatePrompt(currentTab, formData);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 1000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');

        displayOutput(generatedText);

    } catch (error) {
        console.error('Generation error:', error);
        showError('Failed to generate content. Please check your inputs and try again.');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Content';
        loadingSpinner.style.display = 'none';
        outputArea.style.display = 'block';
    }
}

// Display Output
function displayOutput(text) {
    outputArea.innerHTML = `<p>${text}</p>`;
    copyBtn.style.display = 'flex';
}

// Show Error
function showError(message) {
    outputArea.innerHTML = `<div class="error-message">${message}</div>`;
    outputArea.style.display = 'block';
    loadingSpinner.style.display = 'none';
}

// Clear Output
function clearOutput() {
    outputArea.innerHTML = `
        <div class="placeholder">
            <span class="placeholder-icon">📄</span>
            <p>Fill in the details and click "Generate Content" to see your AI-generated output here.</p>
        </div>
    `;
    copyBtn.style.display = 'none';
}

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const text = outputArea.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
        const copyText = copyBtn.querySelector('.copy-text');
        copyText.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyText.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

// Initialize
clearOutput();