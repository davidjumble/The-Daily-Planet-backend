process.env.NODE_ENV = "test";
const app = require("../app");
const {
  topicData,
  userData,
  articleData,
  commentData
} = require("../seed/testData");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const request = require("supertest")(app);

const { expect } = require("chai");

describe("/northcoders-news", () => {
  let topicDocs;
  let userDocs;
  let articleDocs;
  let commentDocs;
  beforeEach(() => {
    return seedDB(topicData, userData, articleData, commentData).then(docs => {
      [topicDocs, userDocs, articleDocs, commentDocs] = docs;
    });
  });
  describe("/api", () => {
    describe("/topics/:topic_slug/articles", () => {
      it("GET responds with status 200 an an object with the articles", () => {
        console.log(articleDocs[0].votes);
        return request
          .get(`/api/topics/mitch/articles`)
          .expect(200)
          .then(res => {
            console.log(articleDocs[0].votes);
            expect(res.body.articles[0]).to.contain.keys([
              "votes",
              "_id",
              "title",
              "created_by",
              "body",
              "belongs_to",
              "__v"
            ]);
          });
      });

      //need to add correct mogo id's and topic then correct chai expects
      it("POST puts a new article into the database", () => {
        return request
          .post("/api/topics/mitch/articles")
          .send({
            title: "new article",
            body: "This is my new article content",
            created_by: "5b198c233b74380310517239"
          })
          .expect(201)
          .then(res => {
            expect(res.body.Article).to.contain.keys(
              "votes",
              "_id",
              "title",
              "created_by",
              "body",
              "belongs_to",
              "__v"
            );
          });
      });
    });

    describe("/articles/:article_id", () => {
      it("PUT increments the vote count of the corresponding article", () => {
        const originalVoteCount = articleDocs[0].votes;
        console.log(articleDocs);
        return request
          .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            console.log(res.body);
            expect(res.body.article.votes).to.equal(originalVoteCount + 1);
          });
      });
    });
  });
  after(() => {
    mongoose.disconnect();
  });
});
