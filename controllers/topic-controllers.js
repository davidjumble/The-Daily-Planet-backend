const TOPICS = require("../models/Topic.js");
const ARTICLES = require("../models/Article.js");
const COMMENTS = require("../models/Comment.js");

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
          console.log(commentTotal);
          console.log(articleObject);
          return {
            ...articleObject._doc,
            comments: commentTotal
          };
        });
      });

      return Promise.all(articlesWithComments);
    })
    .then(articles => {
      console.log(articlesWithComments);
      res.send({ articles });
    })
    .catch(console.log);
};

module.exports = { getTopics, getArticlesByTopic };
