// ========== CONFIG ==========
const API_URL = "http://localhost:5000/api/generate"; // Flask backend endpoint

// ========== UI ELEMENTS ==========
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".form-section");
const generateBtn = document.getElementById("generate-btn");
const outputBox = document.getElementById("output");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error-message");

let currentTab = "bio"; // default tab

// ========== TAB SWITCHING ==========
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;

    sections.forEach(section => {
      section.style.display = section.id === `${currentTab}-form` ? "block" : "none";
    });

    outputBox.textContent = "";
    errorBox.textContent = "";
  });
});

// ========== HELPER FUNCTIONS ==========
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function showError(message) {
  errorBox.textContent = message;
  outputBox.textContent = "";
}

function displayOutput(text) {
  outputBox.textContent = text;
  errorBox.textContent = "";
}

// ========== FORM DATA HANDLER ==========
function collectFormData() {
  const formData = {};
  const form = document.getElementById(`${currentTab}-form`);
  const inputs = form.querySelectorAll("input, textarea, select");

  inputs.forEach(input => {
    const key = input.name || input.id.replace(`${currentTab}-`, "");
    formData[key] = input.value.trim();
  });

  return formData;
}

// ========== MAIN GENERATE FUNCTION ==========
generateBtn.addEventListener("click", async () => {
  const formData = collectFormData();

  showLoader(true);
  showError("");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: currentTab,
        formData: formData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to generate content.");
    }

    if (result.generated_text) {
      displayOutput(result.generated_text);
    } else {
      showError("No content generated. Try again.");
    }
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
});

// ========== HEALTH CHECK (optional) ==========
async function checkBackendStatus() {
  try {
    const res = await fetch("http://localhost:5000/api/health");
    const data = await res.json();
    console.log("Backend:", data.message);
  } catch (err) {
    console.error("Backend not responding.");
  }
}

checkBackendStatus();
