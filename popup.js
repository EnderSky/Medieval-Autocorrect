const toggleButton = document.getElementById("toggle");
const modeToggleButton = document.getElementById("modeToggle");
const currentModeSpan = document.getElementById("currentMode");
const permissionButton = document.getElementById("permissionButton");
const permissionStatus = document.getElementById("permissionStatus");

// Initialize UI
chrome.storage.local.get(["enabled", "useLLM"], (result) => {
  const enabled = result.enabled !== false;
  const useLLM = result.useLLM || false;
  
  updateToggleButton(enabled);
  updateModeButton(useLLM);
  updateModeDisplay(useLLM);
});

// Check initial permission status
checkPermissionStatus();

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
    : "Switch to AI Mode (Disabled)";
}

function updateModeDisplay(useLLM) {
  currentModeSpan.textContent = useLLM ? "AI LLM" : "DICTIONARY";
}

// Handle Google Docs permission request
// permissionButton.addEventListener("click", async () => {
//   const permissions = {
//     origins: [
//       "*://docs.google.com/*",
//       "*://*.google.com/*"
//     ]
//   };
  
//   try {
//     const granted = await chrome.permissions.request(permissions);
    
//     if (granted) {
//       updatePermissionStatus(true);
//       // Notify user
//       permissionStatus.textContent = "✓ Access granted! Reload Google Docs.";
//       permissionStatus.style.color = "#2ecc71";
//     } else {
//       updatePermissionStatus(false);
//       permissionStatus.textContent = "✗ Access denied";
//       permissionStatus.style.color = "#e74c3c";
//     }
//   } catch (error) {
//     console.error("Permission request error:", error);
//     permissionStatus.textContent = "⚠ Error requesting permission";
//     permissionStatus.style.color = "#f39c12";
//   }
// });

// Check if permissions are already granted
async function checkPermissionStatus() {
  const permissions = {
    origins: [
      "*://docs.google.com/*",
      "*://*.google.com/*"
    ]
  };
  
  try {
    const hasPermission = await chrome.permissions.contains(permissions);
    updatePermissionStatus(hasPermission);
  } catch (error) {
    console.error("Permission check error:", error);
    updatePermissionStatus(false);
  }
}

function updatePermissionStatus(granted) {
  if (granted) {
    permissionButton.textContent = "✓ Google Docs Access Granted";
    permissionButton.classList.add("granted");
    permissionStatus.textContent = "Extension can access Google Docs";
    permissionStatus.style.color = "#2ecc71";
  } else {
    permissionButton.textContent = "🔓 Grant Google Docs Access";
    permissionButton.classList.remove("granted");
    permissionStatus.textContent = "Click to enable Google Docs support";
    permissionStatus.style.color = "#c9a961";
  }
}
