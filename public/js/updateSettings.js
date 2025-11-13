import axios from "axios";

export const updateUSerSettings = async (data) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "api/v1/users/updateMe",
      data,
    });
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
      url: "api/v1/users/updatePassword",
      data: {
        password,
        newPassword,
        newPasswordConfirm,
      },
    });
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
