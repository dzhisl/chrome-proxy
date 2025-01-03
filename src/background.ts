let storedUsername: string = "";
let storedPassword: string = "";

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setCredentials") {
    storedUsername = message.username;
    storedPassword = message.password;
    console.log("Credentials stored:", storedUsername, storedPassword);
  }
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
