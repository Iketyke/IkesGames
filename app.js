const { getCategories } = require("./controllers/categoriesControllers");
const express = require("express");
const app = express();

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
