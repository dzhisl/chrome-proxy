import { BASE_BACKEND_URL } from "./constants.js";

// Function to send GET request to the server with the promo code
export function getProxyByPromo(promoCode: string): Promise<void> {
    const url = `${BASE_BACKEND_URL}/proxy?promo=${promoCode}`;
  
    return fetch(url)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to get proxy information");
        }
      })
      .then(data => {
        console.log("Proxy data received:", data);
        setProxyConfig(data.ip, data.port, data.username, data.password);
      });
  }
  
// Utility function to sleep for a given time
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to set proxy configuration
export function setProxyConfig(host: string, port: number, username?: string, password?: string): void {
  const config = {
    mode: "fixed_servers",
    rules: {
      proxyForHttps: { host, port },
      bypassList: [],
    },
  };

  console.log(config);

  if (username && password) {
    sendCredentialsToBackground(username, password);
    // console.log("Sleeping before sending creds to background")
    // await sleep(500); // Add a 500ms delay
    // console.log("Sleep done")
  }

  chrome.proxy.settings.set({ value: config, scope: "regular" });
  console.log("Set proxy in chrome settings")
}
  
  // Function to send credentials to the background script
  export function sendCredentialsToBackground(username: string, password: string): void {
    chrome.runtime.sendMessage({ type: "setCredentials", username, password });
  }
  