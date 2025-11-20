const API_BASE_URL = 'https://avengers-2-1k-8.onrender.com';
let currentType = 'bio';
let history = [];
let isHistoryExpanded = false;

document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupEventListeners();
});

function setupEventListeners() {
    // Content type selection
    document.querySelectorAll('.type-item').forEach(item => {
        item.addEventListener('click', () => {
            switchType(item.dataset.type);
        });
    });
}

function switchType(type) {
    currentType = type;
    
    document.querySelectorAll('.type-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.content-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`.type-item[data-type="${type}"]`).classList.add('active');
    document.getElementById(`${type}-form`).classList.add('active');
}

async function generateContent() {
    const formData = getFormData();
    if (!validateForm(formData)) {
        addMessage('ai', 'Please fill in all required fields (marked with *) to continue.');
        return;
    }

    const btn = document.querySelector('.generate-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;

    addMessage('user', `Generating ${getTypeDisplayName(currentType)}...`);

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: currentType, data: formData })
        });

        const result = await response.json();
        
        if (result.success) {
            addMessage('ai', result.content);
            saveToHistory(currentType, formData, result.content);
            clearCurrentForm();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        addMessage('ai', '🚀 Sorry! I encountered an error while generating content. Please try again.');
    } finally {
        btn.innerHTML = '<i class="fas fa-bolt"></i> Generate';
        btn.disabled = false;
    }
}

function getFormData() {
    const data = {};
    
    if (currentType === 'bio') {
        data.name = document.getElementById('bio-name').value;
        data.skills = document.getElementById('bio-skills').value;
        data.achievements = document.getElementById('bio-achievements').value;
    } else if (currentType === 'project') {
        data.title = document.getElementById('project-title').value;
        data.description = document.getElementById('project-description').value;
        data.technologies = document.getElementById('project-technologies').value;
        data.outcomes = document.getElementById('project-outcomes').value;
    } else if (currentType === 'reflection') {
        data.topic = document.getElementById('reflection-topic').value;
        data.experience = document.getElementById('reflection-experience').value;
        data.learnings = document.getElementById('reflection-learnings').value;
        data.future = document.getElementById('reflection-future').value;
    }
    
    return data;
}

function validateForm(data) {
    if (currentType === 'bio') return data.name && data.skills;
    if (currentType === 'project') return data.title && data.description;
    if (currentType === 'reflection') return data.topic && data.experience;
    return false;
}

function clearCurrentForm() {
    const form = document.getElementById(`${currentType}-form`);
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.value = '');
}

function clearChat() {
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                <i class="fas fa-robot"></i>
            </div>
            <h2>Welcome to Avengers_2.1k Ai</h2>
            <p>I can help you create professional content. Choose a template on the left to get started!</p>
        </div>
    `;
}

function addMessage(sender, text) {
    const messages = document.getElementById('chat-messages');
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'user' ? '👤' : '🤖'}
        </div>
        <div class="message-content">${text}</div>
    `;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function getTypeDisplayName(type) {
    const names = {
        bio: 'Professional Bio',
        project: 'Project Summary',
        reflection: 'Learning Reflection'
    };
    return names[type];
}

// NEW: Function to check if a date is within the last 2 days
function isWithinLastTwoDays(timestamp) {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return new Date(timestamp) >= twoDaysAgo;
}

// NEW: Function to format date for display
function formatHistoryDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

function saveToHistory(type, input, content) {
    const item = {
        id: Date.now(),
        type: type,
        timestamp: new Date().toISOString(), // Store as ISO string for better date handling
        dateDisplay: formatHistoryDate(Date.now()), // Human-readable date
        preview: content.substring(0, 80) + '...',
        fullContent: content, // Store full content for loading
        formData: input // Store form data for context
    };
    
    // Load existing history first
    const saved = localStorage.getItem('avengersHistory');
    if (saved) {
        history = JSON.parse(saved);
    }
    
    // Add new item to beginning
    history.unshift(item);
    
    // Filter out items older than 2 days
    history = history.filter(item => isWithinLastTwoDays(item.timestamp));
    
    // Keep maximum 50 items (in case of heavy usage within 2 days)
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('avengersHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('avengersHistory');
    if (saved) {
        history = JSON.parse(saved);
        
        // Filter to only show items from last 2 days
        history = history.filter(item => isWithinLastTwoDays(item.timestamp));
        
        // Sort by timestamp (newest first)
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    const list = document.getElementById('history-list');
    const actions = document.getElementById('history-actions');
    
    if (history.length === 0) {
        list.innerHTML = '<div class="empty-history">No history from last 2 days</div>';
        actions.style.display = 'none';
        return;
    }
    
    // Show only first 6 items initially, or all if expanded
    const displayItems = isHistoryExpanded ? history : history.slice(0, 6);
    
    list.innerHTML = displayItems.map(item => `
        <div class="history-item" onclick="loadFromHistory('${item.id}')">
            <div class="history-header">
                <div class="history-type">${getTypeDisplayName(item.type)}</div>
                <div class="history-date">${item.dateDisplay}</div>
            </div>
            <div class="history-preview">${item.preview}</div>
        </div>
    `).join('');
    
    // Show "Show More" button if there are more than 6 items
    if (history.length > 6) {
        actions.style.display = 'block';
        const button = actions.querySelector('.read-more-btn');
        button.innerHTML = isHistoryExpanded ? 
            '<i class="fas fa-chevron-up"></i> Show Less' : 
            '<i class="fas fa-chevron-down"></i> Show More';
    } else {
        actions.style.display = 'none';
    }
    
    // Update list class for expanded state
    if (isHistoryExpanded) {
        list.classList.add('expanded');
    } else {
        list.classList.remove('expanded');
    }
}

function toggleHistoryView() {
    isHistoryExpanded = !isHistoryExpanded;
    loadHistory();
}

function loadFromHistory(itemId) {
    const item = history.find(h => h.id == itemId);
    if (!item) return;
    
    // Switch to the correct content type
    switchType(item.type);
    
    // Clear current chat and show the historical content
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = '';
    
    // Show the original user input context
    if (item.formData) {
        let userMessage = `Generate ${getTypeDisplayName(item.type)}`;
        if (item.formData.name || item.formData.title || item.formData.topic) {
            const mainField = item.formData.name || item.formData.title || item.formData.topic;
            userMessage += `: ${mainField}`;
        }
        addMessage('user', userMessage);
    }
    
    // Show the AI response
    addMessage('ai', item.fullContent);
    
    // Show notification
    showTemporaryNotification(`Loaded ${getTypeDisplayName(item.type)} from ${item.dateDisplay}`);
}

function clearHistory() {
    history = [];
    localStorage.removeItem('avengersHistory');
    loadHistory();
    showTemporaryNotification('History cleared');
}

// NEW: Function to show temporary notifications
function showTemporaryNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'history-notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add these CSS animations to your style.css
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    
    .history-date {
        font-size: 11px;
        color: var(--text-secondary);
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Initialize
loadHistory();