const TOPICS = require("../models/Topic.js");
const ARTICLES = require("../models/Article.js");
const COMMENTS = require("../models/Comment.js");
const { formatArticlesForClient } = require("../utils/formating.js");

const getTopics = (req, res, next) => {
  TOPICS.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(console.log);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;

  ARTICLES.find({ belongs_to: topic_slug }).then(articles => {
    res.send({ articles });
  });
};

module.exports = { getTopics, getArticlesByTopic };
