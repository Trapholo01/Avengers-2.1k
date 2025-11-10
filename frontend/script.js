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
        showError('Please complete all required fields');
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
        bio: `Create a professional biography for ${data.name || 'a professional individual'}.

Professional Skills: ${data.skills || 'Not specified'}
Career Achievements: ${data.achievements || 'Not specified'}
Writing Style: ${data.tone}

Generate a professional 150-200 word biography that highlights expertise, experience, and accomplishments. Maintain a formal tone appropriate for professional networking platforms and corporate profiles.`,
        
        project: `Create a comprehensive project summary with the following details:

Project Title: ${data.title || 'Professional Project'}
Project Description: ${data.description || 'Not specified'}
Technologies Utilized: ${data.technologies || 'Not specified'}
Key Outcomes: ${data.outcomes || 'Not specified'}

Develop a detailed 200-250 word project summary that clearly outlines project objectives, technical approach, implementation details, and measurable outcomes. Structure the content professionally with clear sections.`,
        
        reflection: `Compose a professional learning reflection based on:

Learning Topic: ${data.topic || 'Not specified'}
Learning Experience: ${data.experience || 'Not specified'}
Key Insights: ${data.learnings || 'Not specified'}
Practical Applications: ${data.future || 'Not specified'}

Create a 250-300 word reflective analysis that demonstrates critical thinking about the learning process, skill development, and professional growth. Maintain a formal, analytical tone appropriate for professional development documentation.`
    };
    
    return prompts[type];
}

// Generate Content via API
async function generateContent(formData) {
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating Content...';
    
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
        showError('Content generation failed. Please verify your inputs and attempt again. Ensure API credentials are properly configured.');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Professional Content';
        loadingSpinner.style.display = 'none';
        outputArea.style.display = 'block';
    }
}

// Display Output
function displayOutput(text) {
    // Format the text with proper paragraphs
    const formattedText = text.split('\n\n').map(paragraph => 
        `<p>${paragraph}</p>`
    ).join('');
    
    outputArea.innerHTML = formattedText;
    copyBtn.style.display = 'flex';
    
    // Smooth scroll to output
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
            <div class="placeholder-icon">📄</div>
            <p>Complete the input form and generate professional content for your requirements</p>
        </div>
    `;
    copyBtn.style.display = 'none';
}

// Copy to Clipboard
copyBtn.addEventListener('click', async () => {
    const text = outputArea.textContent.trim();
    try {
        await navigator.clipboard.writeText(text);
        
        const copyText = copyBtn.querySelector('.copy-text');
        copyText.textContent = 'Content Copied';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyText.textContent = 'Copy Content';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
});

// Add input validation styling
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#e0e0e0';
            }
        });
    });
});

// Initialize
clearOutput();