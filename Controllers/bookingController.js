const Tour = require("../models/tourModel"),
  catchAsync = require("../utils/catchAsync"),
  stripe = require("stripe")(process.env.STRIPE_SECRETKEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get the tour id from params
  const _id = req.params.tourId;
  const tour = await Tour.findById(_id);

  // stripe session object
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.host}/`,
    cancel_url: `${req.protocol}://${req.host}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: _id,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 2000,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://example.com/tour-cover.jpg`],
          },
        },
      },
    ],
  });
  res.status(200).json({
    status: "Success",
    session,
  });
});
