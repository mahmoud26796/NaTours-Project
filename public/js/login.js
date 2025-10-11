// const axios = require("axios");
import axios from "axios";
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
      alert("Your Are Logged In Suceessfuly!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (e) {
    console.log(e.response.data);
  }
};
