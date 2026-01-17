const toggleButton = document.getElementById("toggle");
const modeToggleButton = document.getElementById("modeToggle");
const currentModeSpan = document.getElementById("currentMode");

// Initialize UI
chrome.storage.local.get(["enabled", "useLLM"], (result) => {
  const enabled = result.enabled !== false;
  const useLLM = result.useLLM || false;
  
  updateToggleButton(enabled);
  updateModeButton(useLLM);
  updateModeDisplay(useLLM);
});

// Toggle extension on/off
toggleButton.addEventListener("click", () => {
  chrome.storage.local.get(["enabled"], (result) => {
    const newState = !(result.enabled !== false);
    chrome.storage.local.set({ enabled: newState });
    updateToggleButton(newState);
  });
});

// Toggle between dictionary and LLM mode
modeToggleButton.addEventListener("click", () => {
  chrome.storage.local.get(["useLLM"], (result) => {
    const newMode = !(result.useLLM || false);
    chrome.storage.local.set({ useLLM: newMode });
    updateModeButton(newMode);
    updateModeDisplay(newMode);
  });
});

function updateToggleButton(enabled) {
  toggleButton.textContent = enabled
    ? "✓ Extension Enabled"
    : "✗ Extension Disabled";
  
  if (enabled) {
    toggleButton.classList.remove("disabled");
  } else {
    toggleButton.classList.add("disabled");
  }
}

function updateModeButton(useLLM) {
  modeToggleButton.textContent = useLLM
    ? "Switch to Dictionary"
    : "Switch to AI Mode";
}

function updateModeDisplay(useLLM) {
  currentModeSpan.textContent = useLLM ? "AI LLM" : "DICTIONARY";
}
