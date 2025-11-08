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
    console.log(session);
  } catch (e) {
    console.log(e);
  }

  // create the chekout page
};
