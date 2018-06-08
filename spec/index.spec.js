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
      it.only("GET responds with status 200 an an object with the articles", () => {
        return request
          .get(`/api/topics/mitch/articles`)
          .expect(200)
          .then(res => {
            console.log(res.body.articles[0]);
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
      //   it("GET responds with status 404 for a valid ID but not in the database", () => {
      //     return request
      //       .get(`/actors/${companyDocs[0]._id}`)
      //       .expect(404)
      //       .then(res => {
      //         expect(res.body.message).to.equal(
      //           `Actor not found! for ID : ${companyDocs[0]._id}`
      //         );
      //       });
      //   });
      //   it("GET responds with status 400 for an invalid mongoID", () => {
      //     return request
      //       .get("/actors/13")
      //       .expect(400)
      //       .then(res => {
      //         expect(res.body.message).to.equal("Bad request : Invalid ObjectId");
      //       });
      //   });
      // });
      // describe("/actors", () => {
      //   it("POST responds with 400 for a body without name", () => {
      //     return request
      //       .post("/actors")
      //       .send({})
      //       .expect(400)
      //       .then(res => {
      //         expect(res.body.message).to.equal(
      //           "actors validation failed: name: Path `name` is required."
      //         );
      //       });
      //   });
    });
  });
  after(() => {
    mongoose.disconnect();
  });
});
