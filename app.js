const { getCategories } = require("./controllers/categoriesController");
const { getReviews, getReview } = require("./controllers/reviewsController");
const { getComments } = require("./controllers/commentsController");

const express = require("express");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getComments);

//Error Handling
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
