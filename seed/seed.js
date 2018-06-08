const mongoose = require("mongoose");
const { Topic, Article, User, Comment } = require("../models/");
const {
  formatArticles,
  createUserRef,
  createArticleRef,
  formatCommentData
} = require("../utils/formating.js");

//right here
mongoose.Promise = Promise;

const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const userIdLookUp = createUserRef(userDocs);

      const formattedArticles = formatArticles(articleData, userIdLookUp);

      return Promise.all([
        Article.insertMany(formattedArticles),
        userDocs,
        topicDocs
      ]);
    })
    .then(([articleDocs, userDocs, topicDocs]) => {
      const userRefObj = createUserRef(userDocs);

      const articleRefObj = createArticleRef(articleDocs);

      const formattedComments = formatCommentData(
        commentData,
        userRefObj,
        articleRefObj
      );

      const commentDocs = Comment.insertMany(formattedComments);
      console.log("seeded ok ********");

      return Promise.all([topicDocs, userDocs, articleDocs, commentDocs]);
    });
};

module.exports = seedDB;
