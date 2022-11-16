const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const connection = require("../db/connection.js");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("/api/categories", () => {
  test("GET - 200 responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length > 0).toBe(true);
        res.body.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});
describe("/api/reviews", () => {
  test("GET - 200 responds with an array of review objects ordered by date descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(13);
        res.body.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              comment_count: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
        expect(res.body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  describe("/api/reviews/:review_id", () => {
    test("GET - 200 responds with a single review object", () => {
      const review_id = 4;
      return request(app)
        .get("/api/reviews/" + review_id)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: review_id,
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
    });
    test("PATCH - 200 increments votes", () => {
      const review_id = 2;
      const votes = { inc_votes: 5 };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(200)
        .then(({ body }) => {
          expect(body.review.review_id).toBe(review_id);
          expect(body.review.votes).toBe(10);
        });
    });
    describe("/api/reviews/:review_id/comments", () => {
      test("GET - 200 responds with an array of comments", () => {
        const review_id = 2;
        return request(app)
          .get("/api/reviews/" + review_id + "/comments")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(3);
            res.body.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  review_id: expect.any(Number),
                })
              );
            });
            expect(res.body).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET - 200 responds with an empty array if no comments found", () => {
        const review_id = 4;
        return request(app)
          .get("/api/reviews/" + review_id + "/comments")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(0);
          });
      });
    });
  });
});

describe("Error Handling", () => {
  test("Endpoint does not exist", () => {
    return request(app)
      .get("/api/thisendpointdoesnotexist")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  describe("/api/reviews/:reviews_id", () => {
    test("GET - 400 invalid review_id: Bad Request", () => {
      return request(app)
        .get("/api/reviews/notavalidreviewid")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("GET - 404 review not found", () => {
      return request(app)
        .get("/api/reviews/1000000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Review Not Found");
        });
    });
    describe("/api/reviews/:reviews_id/comments", () => {
      test("GET - 400 invalid review_id: Bad Request", () => {
        return request(app)
          .get("/api/reviews/notavalidreviewid/comments")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
          });
      });
      test("GET - 404 review not found", () => {
        return request(app)
          .get("/api/reviews/1000000/comments")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Review Not Found");
          });
      });
    });
  });
});
