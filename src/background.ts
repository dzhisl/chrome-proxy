let storedUsername: string = "";
let storedPassword: string = "";
const originalLog = console.log;

// Set default proxy settings to "system" mode
const defaultConfig = { mode: "system" };
chrome.proxy.settings.set({ value: defaultConfig, scope: "regular" }, () => {
  if (chrome.runtime.lastError) {
    console.error("Failed to set default proxy settings:", chrome.runtime.lastError.message);
  } else {
    console.log("Default proxy settings applied (system mode).");
  }
});

// Listen for messages from the popup to set credentials
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setCredentials") {
    storedUsername = message.username;
    storedPassword = message.password;

    console.log("Credentials stored:", { storedUsername, storedPassword });

    // Send acknowledgment back to the sender
    sendResponse({ status: "success", message: "Credentials stored successfully" });
  } else {
    console.warn("Unknown message type received:", message.type);
    sendResponse({ status: "error", message: "Unknown message type" });
  }

  // Return `true` to indicate the response will be sent asynchronously
  return true;
});

chrome.webRequest.onAuthRequired.addListener(
  function (details: chrome.webRequest.WebAuthenticationChallengeDetails, callback?: (response: chrome.webRequest.BlockingResponse) => void) {
    console.log("onAuthRequired:", details);

    if (storedUsername && storedPassword) {
      callback?.({
        authCredentials: { username: storedUsername, password: storedPassword },
      });
    } else {
      console.log("No credentials stored");
    }
  },
  { urls: ["<all_urls>"] },
  ["asyncBlocking"]
);