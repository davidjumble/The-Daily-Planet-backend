const commentsRouter = require("express").Router();
const { pollingStation } = require("../controllers/comment-controllers");

commentsRouter.route("/:comment_id").put(pollingStation);

module.exports = commentsRouter;
