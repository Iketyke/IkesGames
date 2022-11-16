const {
  selectReviews,
  selectReview,
  updateReview,
} = require("../models/reviewsModel");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => next(err));
};

exports.getReview = (req, res, next) => {
  selectReview(req.params.review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => next(err));
};

exports.patchReview = (req, res, next) => {
  console.log(req.body)
  updateReview(req.params.review_id, req.body)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => next(err));
};
