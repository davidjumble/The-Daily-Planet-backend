const ARTICLES = require("../models/Article.js");
const COMMENTS = require("../models/Comment.js");

const getArticles = (req, res, next) => {
  ARTICLES.find()
    .then(articles => {
      const articlesWithComments = articles.map(articleObject => {
        return Promise.all([
          COMMENTS.find({
            belongs_to: articleObject._id
          }).count(),
          articleObject
        ]).then(commentsAndArticlesArray => {
          [commentTotal, articleObject] = commentsAndArticlesArray;

          return {
            ...articleObject._doc,
            comments: commentTotal
          };
        });
      });

      return Promise.all(articlesWithComments);
    })
    .then(articles => {
      res.send({ articles });
    })
    .catch(console.log);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  ARTICLES.find({ _id: article_id })
    .then(articles => {
      const articlesWithComments = articles.map(articleObject => {
        return Promise.all([
          COMMENTS.find({
            belongs_to: articleObject._id
          }).count(),
          articleObject
        ]).then(commentsAndArticlesArray => {
          [commentTotal, articleObject] = commentsAndArticlesArray;

          return {
            ...articleObject._doc,
            comments: commentTotal
          };
        });
      });

      return Promise.all(articlesWithComments);
    })
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

const getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;

  COMMENTS.find({ belongs_to: article_id }).then(comments =>
    res.send({ comments })
  );
};

const tellMeHowYouReallyFeel = (req, res, next) => {
  //posts a comment to an article

  const { article_id } = req.params;

  const formattedComment = {
    votes: 0,
    body: req.body.comment,

    belongs_to: article_id,
    created_by: req.body.created_by,

    __v: 0
  };

  const newComment = new COMMENTS(formattedComment);

  return newComment
    .save()
    .then(Comment => {
      res.status(201).send({ Comment });
    })
    .catch(console.log);
};

const articlePollingStation = (req, res, next) => {
  const { article_id } = req.params;

  const { vote } = req.query;

  let voteIncrement;

  if (vote === "up") {
    voteIncrement = 1;
  }
  if (vote === "down") {
    voteIncrement = -1;
  }

  ARTICLES.findById(article_id, (err, article) => {
    if (article === undefined) {
      return next({
        status: 404,
        message: "article not found: no such id"
      });
    }

    const upVoteCount = article.votes + voteIncrement;

    article.votes = upVoteCount;
    article.save().then(article => res.status(201).send({ article }));
  });
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsForArticle,
  tellMeHowYouReallyFeel,
  articlePollingStation
};
