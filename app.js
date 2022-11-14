const {getReviews, getCategories} = require("./controllers/controller.js")
const express = require("express");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
