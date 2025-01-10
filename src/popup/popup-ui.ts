import { elements } from "./constants.js";
import {  getProxyByPromo } from "./proxy-service.js";
import { showToast } from "./utils.js";

// Utility function to temporarily change button color
async function highlightButton(
  button: HTMLButtonElement,
  color: string = "green",
  duration: number = 1500
): Promise<void> {
  if (color == 'red') {
    button.style.setProperty("--btn-bg-1", "rgb(255, 0, 0)"); // Red
    button.style.setProperty("--btn-bg-2", "hsla(0, 100%, 50%, 1)"); // Red in HSLA  
  }
  if (color == 'green') {
    button.style.setProperty("--btn-bg-1", "rgb(9, 232, 57)"); // Red
    button.style.setProperty("--btn-bg-2", "rgb(27, 223, 69)"); // Red in HSLA  
  }

  setTimeout(() => {
    button.style.setProperty("--btn-bg-1", "rgb(0, 106, 255)"); // Blue
    button.style.setProperty("--btn-bg-2", "hsla(270, 100%, 45%, 1)"); // Blue in HSLA
  }, duration);
}

elements.default.onclick = async () => {
  console.log("Setting default settings");
  const config = { mode: "system" };
  chrome.proxy.settings.set({ value: config, scope: "regular" });
  highlightButton(elements.default, "green");
  await showToast("Done");
  chrome.proxy.settings.get({ incognito: false }, function(details) {
    console.log("Proxy Settings:", details.value);
});
};

// Handlers
elements.connectPromo.onclick = async () => {
  const promoCode = elements.promo.value.trim();
  console.log("Attempting to connect using promo code:", promoCode);

  if (!promoCode) {
    await highlightButton(elements.connectPromo, "red");
    showToast("Promo code is required", "red");
    console.error("Promo code is required");
    return;
  }

  if (promoCode == "cfg") {
    chrome.proxy.settings.get({ incognito: false }, (config) => {
      if (chrome.runtime.lastError) {
        showToast("Failed to get proxy settings", "red");
        console.error("Failed to get proxy settings");
      } else {
        alert(JSON.stringify(config));
      }
    });
    return;
  }

  try {
    console.log("calling getProxyByPromo")
    await getProxyByPromo(promoCode);
    console.log("getProxyByPromo Done! Showing highlightButton")
    await highlightButton(elements.connectPromo);
    console.log("highlightButton Done! Showing toast")

    showToast("Promo applied successfully", "green");
    chrome.proxy.settings.get({ incognito: false }, function(details) {
      console.log("Proxy Settings:", details.value);
  });
  
    console.log(`Toast done! Promo code applied successfully`);
  } catch (error) {
    console.error("Failed to apply promo code:", error);
    await highlightButton(elements.connectPromo, "red");
    showToast("Invalid promo code", "red");
  }
};
