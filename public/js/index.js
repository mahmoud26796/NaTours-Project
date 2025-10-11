import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";

const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".form");

const email = document.getElementById("email");
const password = document.getElementById("password");

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
