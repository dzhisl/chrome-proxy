import { elements } from "./constants.js";
import { setProxyConfig, getProxyByPromo } from "./proxy-service.js";
import { showToast } from "./utils.js";

// Function to temporarily change button color
function highlightButton(button: HTMLButtonElement, color: string = "green") {
  const originalColor = button.style.backgroundColor;
  button.style.backgroundColor = color;
  setTimeout(() => {
    button.style.backgroundColor = originalColor;
  }, 500);
}

// elements.dropDownButton.onclick = () => {
//   const connectionSettings = document.getElementById("connectionSettings");
//   if (connectionSettings) {
//     if (
//       connectionSettings.style.display === "none" ||
//       connectionSettings.style.display === ""
//     ) {
//       connectionSettings.style.display = "block";
//       elements.dropDownButton.value = "Hide Connection Settings";
//     } else {
//       connectionSettings.style.display = "none";
//       elements.dropDownButton.value = "Configure Connection Settings";
//     }
//   }
// };

elements.connectPromo.onclick = () => {
  const promoCode = elements.promo.value;
  if (!promoCode) {
    highlightButton(elements.connectPromo, "red");
    showToast("Promo code is required", "red");
    console.error("Promo code is required");
    return;
  }
  getProxyByPromo(promoCode)
    .then(() => {
      highlightButton(elements.connectPromo);
      showToast("Done");
    })
    .catch(() => {
      highlightButton(elements.connectPromo, "red");
      showToast("Invalid code", "red");
    });
};

elements.set.onclick = () => {
  const host = elements.host.value;
  const port = parseInt(elements.port.value, 10);
  if (!host || isNaN(port)) {
    showToast("Invalid host or port", "red");
    console.error("Invalid host or port");
    return;
  }
  setProxyConfig(host, port, elements.username.value, elements.password.value);
  showToast("Done");
};

elements.get.onclick = () => {
  chrome.proxy.settings.get({ incognito: false }, (config) => {
    if (chrome.runtime.lastError) {
      showToast("Failed to get proxy settings", "red");
      console.error("Failed to get proxy settings");
    } else {
      alert(JSON.stringify(config));
    }
  });
};

elements.default.onclick = () => {
  console.log("Setting default settings");
  showToast("Done");
  const config = { mode: "system" };
  chrome.proxy.settings.set({ value: config, scope: "regular" });
  highlightButton(elements.default, "green");
};
