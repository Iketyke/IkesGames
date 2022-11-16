const { getCategories } = require("./controllers/categoriesController");
const { getReviews, getReview, patchReview } = require("./controllers/reviewsController");
const { getComments, postComment } = require("./controllers/commentsController");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview)

//Error Handling
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    if (err.detail.endsWith('"reviews".')) res.status(404).send({ msg: "Review Not Found" });
    else if (err.detail.endsWith('"users".')) res.status(404).send({ msg: "User Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
