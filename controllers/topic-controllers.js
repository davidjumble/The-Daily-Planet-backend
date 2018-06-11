const TOPICS = require("../models/Topic.js");
const ARTICLES = require("../models/Article.js");
const COMMENTS = require("../models/Comment.js");
const USER = require("../models/User.js");
const { createUserRef } = require("../utils/formating.js");

const getTopics = (req, res, next) => {
  TOPICS.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(console.log);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;

  //pass articleDocs into a function that finds the number of comments with that article mongo iD and gives it that property

  ARTICLES.find({ belongs_to: topic_slug })
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
      if (articles.length === 0)
        return next({
          status: 404,
          message: `Sorry, no Articles about ${topic_slug}`
        });
      res.send({ articles });
    })
    .catch(next);
};

const postArticle = (req, res, next) => {
  console.log("you can do it");
  const { topic_slug } = req.params;

  const formattedArticle = {
    votes: 0,
    ...req.body,
    belongs_to: topic_slug,

    __v: 0
  };

  const newArticle = new ARTICLES(formattedArticle);

  return newArticle
    .save()
    .then(Article => {
      res.status(201).send({ Article });
    })
    .catch(next);
};

module.exports = { getTopics, getArticlesByTopic, postArticle };
