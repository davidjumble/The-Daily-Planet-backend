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

  //Topic tests

  describe("/api", () => {
    describe("/topics", () => {
      it("GET responds with an array of topics", () => {
        const testTopic = topicDocs[0].slug;
        return request
          .get(`/api/topics`)
          .expect(200)
          .then(res => {
            expect(res.body.topics[0].slug).to.equal(testTopic);
          });
      });
    });

    describe("/topics/:topic_slug/articles", () => {
      it("GET responds with status 200 and an object with the articles", () => {
        return request
          .get(`/api/topics/mitch/articles`)
          .expect(200)
          .then(res => {
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

      it("GET responds with status 404 when given a vacant topic", () => {
        return request
          .get(`/api/topics/ennui/articles`)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(`Sorry, no Articles about ennui`);
          });
      });

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

      it("POST responds with a 400 for an empty gesture", () => {
        return request
          .post("/api/topics/mitch/articles")
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "articles validation failed: created_by: Path `created_by` is required., title: Path `title` is required."
            );
          });
      });
    });

    //article tests

    describe("/articles", () => {
      it("GET responds with an array of articles", () => {
        const testTitle = articleDocs[0].title;
        return request
          .get(`/api/articles`)
          .expect(200)
          .then(res => {
            expect(res.body.articles[0].title).to.equal(testTitle);
          });
      });
    });

    describe("/articles/article_id", () => {
      it("GET responds with status 200 and the specific article", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article[0].title).to.equal(articleDocs[0].title);
          });
      });

      it("GET responds with status 400 when given an invalid mongo id", () => {
        return request
          .get(`/api/articles/808`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal("Bad request : Invalid ObjectId");
          });
      });

      it("PUT increments the vote count of the corresponding article", () => {
        const originalVoteCount = articleDocs[0].votes;

        return request
          .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.equal(originalVoteCount + 1);
          });
      });
    });

    //comment tests

    describe("/comments/comment_id", () => {
      it("PUT increments the vote count of the corresponding comment", () => {
        const originalVoteCount = commentDocs[0].votes;

        return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body.comment.votes).to.equal(originalVoteCount + 1);
          });
      });

      it("PUT responds with 404 for an invalid mongo id", () => {
        const originalVoteCount = commentDocs[0].votes;

        return request
          .put(`/api/comments/401?vote=up`)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal("comment not found: no such id");
          });
      });
    });

    it("DELETE removes a comment", () => {
      const deletedId = commentDocs[0]._id;
      return request
        .del(`/api/comments/${commentDocs[0]._id}`)
        .expect(202)
        .then(res => {
          expect(res.body.message).to.equal(`${deletedId} Comment deleted`);
        });
    });

    //user tests

    describe("/users/user_id", () => {
      it("GET responds with status 200 and the specific user", () => {
        return request
          .get(`/api/users/${userDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.user.name).to.equal(userDocs[0].name);
          });
      });
    });
  });

  after(() => {
    mongoose.disconnect();
  });
});
