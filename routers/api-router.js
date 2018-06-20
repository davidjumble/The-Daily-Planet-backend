const apiRouter = require("express").Router();
const topicRouter = require("./topic-router.js");
const commentsRouter = require("./comments-router.js");
const articleRouter = require("./article-router.js");
const userRouter = require("./user-router.js");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
