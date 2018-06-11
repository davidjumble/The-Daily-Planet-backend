const ARTICLES = require("../models/Article.js");
const COMMENTS = require("../models/Comment.js");

const getArticles = (req, res, next) => {
  console.log("yes...,  finally, salvation");

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
      console.log(articles);
      res.send({ articles });
    })
    .catch(console.log);
};

const getArticleById = (req, res, next) => {
  console.log("float like a leaf on the river of life");
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
  console.log("cooooooo  eeeeeeeeeee");

  const { article_id } = req.params;

  COMMENTS.find({ belongs_to: article_id }).then(comments =>
    res.send({ comments })
  );
};

const tellMeHowYouReallyFeel = (req, res, next) => {
  //posts a comment to an article
  console.log("you can do it");
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
      console.log(Comment);
      res.status(201).send({ Comment });
    })
    .catch(console.log);
};

const articlePollingStation = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);

  const { vote } = req.query;

  if (vote === "up") {
    ARTICLES.findById(article_id, (err, article) => {
      const upVoteCount = article.votes + 1;

      article.votes = upVoteCount;
      article.save().then(article => res.status(201).send({ article }));
    });
  }

  if (vote === "down") {
    ARTICLES.findById(article_id, (err, article) => {
      const downVoteCount = article.votes - 1;

      article.votes = downVoteCount;
      article.save().then(article => res.status(201).send({ article }));
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsForArticle,
  tellMeHowYouReallyFeel,
  articlePollingStation
};
