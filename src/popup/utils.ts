import { elements } from "./constants.js";

export async function showToast(message = 'Done!', color = 'green') {
  elements.toast.textContent = message;
  elements.toast.style.backgroundColor = color;
  // Show the toast
  elements.toast.classList.add("show");
  
  // Hide the toast after 3 seconds
  setTimeout(function () {
    elements.toast.classList.add("hide"); // Add hide class to trigger disappearance
  }, 1500); // 3000ms = 3 seconds before starting to hide

  // Reset the visibility and remove the classes after the transition ends
  setTimeout(function () {
    elements.toast.classList.remove("show", "hide");
  }, 2000); // 3500ms = 3 seconds for showing + 0.5 seconds for fading out
}
