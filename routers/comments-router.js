const commentsRouter = require("express").Router();
const {
  commentPollingStation,
  deleteComment
} = require("../controllers/comment-controllers");

commentsRouter
  .route("/:comment_id")
  .put(commentPollingStation)
  .delete(deleteComment);

module.exports = commentsRouter;
