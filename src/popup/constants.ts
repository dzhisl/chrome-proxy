export const elements = {
  host: document.getElementById("host") as HTMLInputElement,
  port: document.getElementById("port") as HTMLInputElement,
  set: document.getElementById("set") as HTMLButtonElement,
  get: document.getElementById("get") as HTMLButtonElement,
  default: document.getElementById("default") as HTMLButtonElement,
  text: document.getElementById("text") as HTMLTextAreaElement,
  username: document.getElementById("username") as HTMLInputElement,
  password: document.getElementById("password") as HTMLInputElement,
  promo: document.getElementById("promo") as HTMLInputElement,
  connectPromo: document.getElementById("connect-promo") as HTMLButtonElement,
  dropDownButton: document.getElementById("showInputsButton") as HTMLButtonElement,
  toast: document.getElementById("toast") as HTMLButtonElement

};

export const BASE_BACKEND_URL = "https://pleho.pro"