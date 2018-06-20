const COMMENT = require("../models/Comment.js");

const commentPollingStation = (req, res, next) => {
  const { comment_id } = req.params;

  const { vote } = req.query;
  let voteIncrement;

  if (vote === "up") {
    voteIncrement = 1;
  }
  if (vote === "down") {
    voteIncrement = -1;
  }

  COMMENT.findById(comment_id, (err, comment) => {
    if (comment === undefined) {
      return next({
        status: 404,
        message: "comment not found: no such id"
      });
    }
    const VoteCount = comment.votes + voteIncrement;

    comment.votes = VoteCount;
    comment.save().then(comment => res.status(201).send({ comment }));
  });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  COMMENT.findByIdAndRemove(comment_id)
    .then(comment => {
      if (comment === undefined) {
        return next({
          status: 404,
          message: "comment not found: no such id"
        });
      }
      res.status(202).send({ message: `${comment_id} Comment deleted` });
    })
    .catch(next);
};

module.exports = {
  commentPollingStation,
  deleteComment
};
