import axios from "axios";
import { showAlert } from "./alerts";
export const logOutUI = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "success") {
      showAlert(res.data.status, "You Are Logged Out!");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  } catch (e) {
    console.log(e.response);
  }
};
