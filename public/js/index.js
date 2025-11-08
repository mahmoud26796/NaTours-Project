import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";
import { logOutUI } from "./logout";
import { updateUSerSettings, updateUserPassword } from "./updateSettings";

const mapbox = document.getElementById("map"),
  //login form inputs
  loginForm = document.querySelector(".form"),
  email = document.getElementById("email"),
  password = document.getElementById("password"),
  logOutBtn = document.getElementById("logoutUI"),
  // user data and settings form inputs
  settingsForm = document.querySelector(".form-user-data"),
  name = document.getElementById("name"),
  email_set = document.getElementById("email_set"),
  photo = document.getElementById("photo"),
  // password changes form inputs
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
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("email", email_set.value);
    formData.append("photo", photo.files[0]);
    console.log(name.value, email_set.value, photo.files);

    updateUSerSettings(formData);
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUserPassword(currentPass.value, newPass.value, passConfirm.value);
    // console.log(currentPass.value, newPass.value, passConfirm.value);
  });
}
