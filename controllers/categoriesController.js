const { selectCategories } = require("../models/categoriesModel");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => next(err));
};
