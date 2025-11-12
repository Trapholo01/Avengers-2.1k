// API Configuration
const API_BASE_URL = 'https://avengers-2-1k-8.onrender.com';

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

// Generate Content via Backend API
async function generateContent(formData) {
  isGenerating = true;
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating with AI...';

  // Show loading
  outputArea.style.display = 'none';
  loadingSpinner.style.display = 'flex';
  copyBtn.style.display = 'none';

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: currentTab,
        data: formData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to generate content');
    }

    if (result.success) {
      displayOutput(result.content);
      console.log('✅ Content generated with:', result.aiProvider);
    } else {
      throw new Error('Generation failed');
    }

  } catch (error) {
    console.error('Generation error:', error);
    showError(`Content generation failed: ${error.message}. Please try again.`);
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
    `<p>${paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`
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
    copyText.textContent = 'Content Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyText.textContent = 'Copy Content';
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
});

// Initialize
clearOutput();

// Test backend connection on load
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Backend connection successful');
      showNotification('Connected to AI backend', 'success');
    } else {
      console.warn('⚠️ Backend connection issue');
      showNotification('Backend connection issue', 'warning');
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    showNotification('Cannot connect to backend server', 'error');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Simple notification - you can enhance this with a proper notification system
  console.log(`${type.toUpperCase()}: ${message}`);
}

// Test connection when page loads
document.addEventListener('DOMContentLoaded', testBackendConnection);
