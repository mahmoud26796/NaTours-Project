import axios from "axios";

export const logOutUI = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:5000/api/v1/users/logout",
    });
    if (res.data.status === "success") {
      alert("Logged Out Suceessfuly!");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  } catch (e) {
    console.log(e.response);

    // alert("Logging Out Faild!", e);
  }
};
