const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsForArticle,
  tellMeHowYouReallyFeel,
  articlePollingStation
} = require("../controllers/article-controllers");

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .put(articlePollingStation);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(tellMeHowYouReallyFeel);

module.exports = articleRouter;
