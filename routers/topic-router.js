const topicRouter = require("express").Router();
const {
  getTopics,
  getArticlesByTopic
} = require("../controllers/topic-controllers.js");

topicRouter.route("/").get(getTopics);

//need to sort this out
topicRouter.route("/:topic_slug/articles").get(getArticlesByTopic);

module.exports = topicRouter;
