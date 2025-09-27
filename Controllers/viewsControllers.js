exports.renderRoot = (req, res) => {
  res.status(200).render("base", {
    user: {
      name: "jonas",
    },
  });
};

exports.renderAllTours = (req, res) => {
  res.status(200).render("overview", {
    data: "All Tours",
  });
};

exports.renderTour = (req, res) => {
  res.status(200).render("tour", {
    tour: {
      name: "The Arabic Shine",
    },
  });
};
