const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = require("../config");
const topicData = require("./devData/topics.json");
const articalData = require("./devData/articles.json");
const commentData = require("./devData/comments.json");
const userData = require("./devData/users.json");

mongoose
  .connect(DB_URL)
  .then(() => {
    // console.log(topicData);
    return seedDB(topicData, userData, articalData, commentData);
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch(console.log);
