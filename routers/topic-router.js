const topicRouter = require("express").Router();
const {
  getTopics,
  getArticlesByTopic,
  postArticle
} = require("../controllers/topic-controllers.js");

topicRouter.route("/").get(getTopics);

topicRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(postArticle);

module.exports = topicRouter;
