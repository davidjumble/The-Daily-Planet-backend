const mongoose = require("mongoose");
const TOPIC = require("../models/topic.js");
const USERS = require("../models/user.js");
const ARTICLES = require("../models/article.js");
const COMMENTS = require("../models/comment.js");
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
        TOPIC.insertMany(topicData),
        USERS.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const userIdLookUp = createUserRef(userDocs);
      console.log(userIdLookUp);
      const formattedArticles = formatArticles(articleData, userIdLookUp);

      return Promise.all([ARTICLES.insertMany(formattedArticles), userDocs]);
    })
    .then(([articleDocs, userDocs]) => {
      console.log(userDocs, articleDocs);
      const userRefObj = createUserRef(userDocs);
      console.log(userRefObj);
      const articleRefObj = createArticleRef(articleDocs);
      console.log(articleRefObj);
      const formattedComments = formatCommentData(
        commentData,
        userRefObj,
        articleRefObj
      );
      console.log(formattedComments);

      // console.log(userRef);
    });
};

module.exports = seedDB;
