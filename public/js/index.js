import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";
import { logOutUI } from "./logout";
import { updateUSerSettings, updateUserPassword } from "./updateSettings";

const mapbox = document.getElementById("map"),
  loginForm = document.querySelector(".form"),
  settingsForm = document.querySelector(".form-user-data"),
  email = document.getElementById("email"),
  password = document.getElementById("password"),
  logOutBtn = document.querySelector(".nav__el--logout"),
  name = document.getElementById("name"),
  email_set = document.getElementById("email_set"),
  passwordForm = document.querySelector(".form-user-password"),
  currentPass = document.getElementById("password-current"),
  newPass = document.getElementById("password"),
  passConfirm = document.getElementById("password-confirm");

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(email.value, password.value);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logOutUI);
}

if (settingsForm) {
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUSerSettings(name.value, email_set.value);
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUserPassword(currentPass.value, newPass.value, passConfirm.value);
    // console.log(currentPass.value, newPass.value, passConfirm.value);
  });
}
