const TOPICS = require("../models/Topic.js");

const getTopics = (req, res, next) => {
  console.log("ellllo");
  TOPICS.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(console.log);
};

const getArticlesByTopic = (req, res, next) => {
  console.log("iiiiyaaaa");
};

module.exports = { getTopics, getArticlesByTopic };
