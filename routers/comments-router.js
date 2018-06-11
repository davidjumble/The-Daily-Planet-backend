const commentsRouter = require("express").Router();
const {
  pollingStation,
  deleteComment
} = require("../controllers/comment-controllers");

commentsRouter
  .route("/:comment_id")
  .put(pollingStation)
  .delete(deleteComment);

module.exports = commentsRouter;
