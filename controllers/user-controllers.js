const USERS = require("../models/User.js");

const getUsers = (req, res, next) => {
  const { user_id } = req.params;

  USERS.findById(user_id)
    .then(user => {
      res.send({ user });
    })
    .catch(next);
};

module.exports = {
  getUsers
};
