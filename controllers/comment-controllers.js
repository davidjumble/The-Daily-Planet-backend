const COMMENT = require("../models/Comment.js");

const pollingStation = (req, res, next) => {
  const { comment_id } = req.params;

  console.log(req.query);

  const { vote } = req.query;

  console.log(vote);

  //Is there a better way to do this than two condtionals, letya boy know

  if (vote === "up") {
    COMMENT.findById(comment_id, (err, comment) => {
      const upVoteCount = comment.votes + 1;

      comment.votes = upVoteCount;
      comment.save().then(comment => res.send(comment));
    });
  }

  if (vote === "down") {
    COMMENT.findById(comment_id, (err, comment) => {
      const downVoteCount = comment.votes - 1;

      comment.votes = downVoteCount;
      comment.save().then(comment => res.send(comment));
    });
  }
};

const deleteComment = (req, res, next) => {};

module.exports = {
  pollingStation,
  deleteComment
};
