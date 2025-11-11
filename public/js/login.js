// const axios = require("axios");
import axios from "axios";
import { showAlert } from "./alerts";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:5000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    console.log(res.data);
    if (res.data.status === "success") {
      showAlert(res.data.status, "Your Are Logged In !");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  } catch (e) {
    console.log(e.response.data);
  }
};
