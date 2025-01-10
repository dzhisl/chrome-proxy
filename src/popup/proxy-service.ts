import { BASE_BACKEND_URL } from "./constants.js";

/**
 * Sends a GET request to the backend with the promo code to fetch proxy details.
 * @param promoCode The promo code used to retrieve proxy information.
 * @returns A promise that resolves when the proxy is configured.
 */
export async function getProxyByPromo(promoCode: string): Promise<void> {
  const url = `${BASE_BACKEND_URL}/proxy?promo=${encodeURIComponent(promoCode)}`;
  console.log("getProxyByPromo: Sending request to backend with promo code:", promoCode);

  try {
    const response = await fetch(url);
    console.log("getProxyByPromo: Received response from backend with status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("getProxyByPromo: Proxy data received:", data);

      await setProxyConfig(data.ip, data.port, data.username, data.password);
    } else {
      console.error("Failed to fetch proxy information. Status code:", response.status);
      throw new Error(`Failed to fetch proxy information. HTTP Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching proxy by promo code:", error);
    throw error;
  }
}

/**
 * Configures the proxy settings in Chrome.
 * @param host The proxy server hostname or IP.
 * @param port The proxy server port.
 * @param username Optional username for authentication.
 * @param password Optional password for authentication.
 * @returns A promise that resolves when the configuration is applied.
 */
export async function setProxyConfig(
  host: string,
  port: number,
  username?: string,
  password?: string
): Promise<void> {
  if (!host || isNaN(port)) {
    console.error("setProxyConfig: Invalid host or port provided:", { host, port });
    throw new Error("Invalid host or port");
  }

  const config = {
    mode: "fixed_servers",
    rules: {
      proxyForHttps: { host, port },
      bypassList: [],
    },
  };

  console.log("setProxyConfig: Applying proxy configuration:", config);

  try {
    if (username && password) {
      await sendCredentialsToBackground(username, password);
    }

    // Function to set proxy settings
    const setProxySettings = async (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
          if (chrome.runtime.lastError) {
            console.error("setProxyConfig: Failed to set proxy settings:", chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log("setProxyConfig: Proxy settings successfully applied in Chrome.");
            resolve();
          }
        });
      });
    };

    // Apply proxy settings, wait, and reapply
    await setProxySettings();
    await sleep(1000);
    await setProxySettings();

    console.log("setProxyConfig: Re-applied proxy settings after waiting for 1 second.");
  } catch (error) {
    console.error("setProxyConfig: Error setting proxy configuration:", error);
    throw error;
  }
}


/**
 * Sends credentials to the background script for storage.
 * @param username The username for proxy authentication.
 * @param password The password for proxy authentication.
 * @returns A promise that resolves when the message is sent.
 */
export function sendCredentialsToBackground(username: string, password: string): Promise<void> {
  console.log("sendCredentialsToBackground: Sending credentials to background script:", { username, password });

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "setCredentials", username, password },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("sendCredentialsToBackground: Failed to send credentials to background script:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        } else {
          console.log("sendCredentialsToBackground: Credentials successfully sent to background script.");
          resolve();
        }
      }
    );
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
