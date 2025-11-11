import axios from "axios";
// const stripe = Stripe(
//   pk_test_51SQXibRjPltENXaLXDPW6y48amyrk41RHZe9IfirwhRuabV9lbSZcU0BuVVte5IUVJQMxgmOROad675PpJVkJnk5008CIZLNO8
// );
export const bookTour = async (tourId) => {
  // getting the session from our api
  try {
    const session = await axios(
      `http://localhost:5000/api/v1/bookings/checkout/${tourId}`
    );
    if (session.data.status === "success") {
    }
    console.log(session);
  } catch (e) {
    console.log(e);
  }
  window.setTimeout(() => {
    window.location.href = "/checkout";
  }, 1000);
  // create the chekout page
};
