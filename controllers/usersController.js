const { selectUsers } = require("../models/usersModel");

exports.getUsers = (req, res) => {
  selectUsers()
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};
