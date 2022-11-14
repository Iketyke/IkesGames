const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

describe("/api/categories", () => {
  test("GET - 200 responds with an array of category objects", () => {
    return request(app)
        .get("/api/categories")
        .expect(200)
        .then(res => {
            expect(Array.isArray(res.body)).toBe(true);
            res.body.forEach(category => {
                expect(category).toHaveProperty("slug");
                expect(category).toHaveProperty("description");
            })
        })
  });
});

describe('Error Handling', () => {
    test('Endpoint does not exist', () => {
        return request(app)
            .get("/api/thisendpointdoesnotexist")
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
});
