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
describe("/api/users", () => {
  test("GET - 200 responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE - 204 deletes the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
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
      const review_id = 2;
      return request(app)
        .get("/api/reviews/" + review_id)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: review_id,
              title: "Jenga",
              review_body: "Fiddly fun for all the family",
              designer: "Leslie Scott",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 5,
              category: "dexterity",
              owner: "philippaclaire9",
              created_at: expect.any(String),
            })
          );
        });
    });
    test("GET - 200 responds with a single review object with a comment count", () => {
      const review_id = 2;
      return request(app)
        .get("/api/reviews/" + review_id)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              comment_count: "3",
              review_id: review_id,
              title: "Jenga",
              review_body: "Fiddly fun for all the family",
              designer: "Leslie Scott",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 5,
              category: "dexterity",
              owner: "philippaclaire9",
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
    test("PATCH - 200 also Decrements votes", () => {
      const review_id = 2;
      const votes = { inc_votes: -2 };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(200)
        .then(({ body }) => {
          expect(body.review.review_id).toBe(review_id);
          expect(body.review.votes).toBe(3);
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
      test("POST - 201 responds with the posted comment", () => {
        const review_id = 4;
        const comment = {
          username: "mallionaire",
          body: "luv me games, simple as",
        };
        return request(app)
          .post("/api/reviews/" + review_id + "/comments")
          .send(comment)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                body: "luv me games, simple as",
                votes: 0,
                author: "mallionaire",
                review_id: review_id,
                created_at: expect.any(String),
              })
            );
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
    test("PATCH - 400 invalid review_id: Bad Request", () => {
      const review_id = "notareviewid";
      const votes = { inc_votes: -2 };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("PATCH - 404 review not found", () => {
      const review_id = 100000;
      const votes = { inc_votes: -2 };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review Not Found");
        });
    });
    test("PATCH - 400 invalid object - inc_votes missing", () => {
      const review_id = 2;
      const votes = {};
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Format");
        });
    });
    test("PATCH - 400 invalid object - inc_votes is the wrong type", () => {
      const review_id = 2;
      const votes = { inc_votes: "five" };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Format");
        });
    });
    test("PATCH - 400 invalid object - inc_votes is misspelt", () => {
      const review_id = 2;
      const votes = { inc_votea: "five" };
      return request(app)
        .patch("/api/reviews/" + review_id)
        .send(votes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Format");
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
      test("POST - 400 invalid review_id: Bad Request", () => {
        const comment = {
          username: "mallionaire",
          body: "luv me games, simple as",
        };
        return request(app)
          .post("/api/reviews/notavalidreviewid/comments")
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
          });
      });
      test("POST - 404 review not found", () => {
        const comment = {
          username: "mallionaire",
          body: "luv me games, simple as",
        };
        return request(app)
          .post("/api/reviews/1000000/comments")
          .send(comment)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Review Not Found");
          });
      });
      test("POST - 404 Username not found", () => {
        const comment = {
          username: "iketyke",
          body: "luv me games, simple as",
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(comment)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("User Not Found");
          });
      });
      test("POST - 400 invalid object - body missing", () => {
        const comment = {
          username: "mallionaire",
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Format");
          });
      });
      test("POST - 400 empty body in the object", () => {
        const comment = {
          username: "mallionaire",
          body: "",
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Format");
          });
      });
      test("POST - 400 Body is an invalid type - number", () => {
        const comment = {
          username: "mallionaire",
          body: 231759075,
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Format");
          });
      });
      test("POST - 400 Body is an invalid type - array", () => {
        const comment = {
          username: "mallionaire",
          body: [1, 2, 3, 4, 5],
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(comment)
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Format");
          });
      });
    });
  });
});
