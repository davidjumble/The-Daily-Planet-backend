const userRouter = require("express").Router();
const { getUsers } = require("../controllers/user-controllers.js");

userRouter.route("/:user_id").get(getUsers);

module.exports = userRouter;
