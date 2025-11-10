// ========== CONFIG ==========
const API_URL = "http://localhost:5000/api/generate"; // Backend endpoint

// ========== UI ELEMENTS ==========
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".form-content");
const generateBtn = document.getElementById("generate-btn");
const outputBox = document.getElementById("output-area");
const loader = document.getElementById("loading-spinner");
const copyBtn = document.getElementById("copy-btn");

let currentTab = "bio"; // default tab

// ========== TAB SWITCHING ==========
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;

    sections.forEach(section => {
      section.classList.toggle("active", section.id === `${currentTab}-form`);
    });

    // Reset output
    outputBox.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">📄</div>
        <p>Complete the input form and generate professional content for your requirements</p>
      </div>
    `;
    copyBtn.style.display = "none";
  });
});

// ========== HELPER FUNCTIONS ==========
function showLoader(show) {
  loader.style.display = show ? "flex" : "none";
}

function displayOutput(text) {
  outputBox.textContent = text;
  copyBtn.style.display = "inline-block";
}

// ========== COPY BUTTON ==========
copyBtn.addEventListener("click", () => {
  const text = outputBox.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Content";
    }, 2000);
  });
});

// ========== COLLECT FORM DATA ==========
function collectFormData() {
  const formData = {};
  const form = document.getElementById(`${currentTab}-form`);
  const inputs = form.querySelectorAll("input, textarea, select");

  inputs.forEach(input => {
    const key = input.id; // match backend mapping
    formData[key] = input.value.trim();
  });

  return formData;
}

// ========== MAIN GENERATE FUNCTION ==========
generateBtn.addEventListener("click", async () => {
  const formData = collectFormData();
  showLoader(true);
  outputBox.innerHTML = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: currentTab, formData })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Failed to generate content.");

    displayOutput(result.generated_text);

  } catch (err) {
    outputBox.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  } finally {
    showLoader(false);
  }
});

// ========== HEALTH CHECK ==========
async function checkBackendStatus() {
  try {
    const res = await fetch("http://localhost:5000/api/health");
    const data = await res.json();
    console.log("Backend status:", data.message);
  } catch (err) {
    console.error("Backend not responding.");
  }
}

checkBackendStatus();
