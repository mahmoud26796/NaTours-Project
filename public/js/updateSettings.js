import axios from "axios";

export const updateUSerSettings = async (data) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://localhost:5000/api/v1/users/updateMe",
      data,
    });
    console.log(res.data);
    if (res.status === "success") {
      alert("Data Changed Successfuly!");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (e) {
    console.log(e.response.data);
  }
};

export const updateUserPassword = async (
  password,
  newPassword,
  newPasswordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://localhost:5000/api/v1/users/updatePassword",
      data: {
        password,
        newPassword,
        newPasswordConfirm,
      },
    });
    console.log(res.data);
    if (res.status === "success") {
      alert("Password Chaned Successfuly");
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (e) {
    console.log(e.response.data);
  }
};
