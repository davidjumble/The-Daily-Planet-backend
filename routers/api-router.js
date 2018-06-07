const apiRouter = require("express").Router();
const topicRouter = require("./topic-router.js");

apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
