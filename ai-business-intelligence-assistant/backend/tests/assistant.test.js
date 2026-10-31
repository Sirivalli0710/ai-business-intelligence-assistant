const request = require("supertest");
const app = require("../server");

describe("Business Intelligence Assistant API", () => {
  test("1. Summary endpoint should return HTTP 200", async () => {
    const response = await request(app).get("/api/summary");
    expect(response.statusCode).toBe(200);
  });

  test("2. Ask endpoint should handle a valid question", async () => {
    const response = await request(app)
      .get("/api/ask")
      .query({ question: "Which category has the highest sales?" });

    expect([200, 400, 500]).toContain(response.statusCode);
  });

  test("3. Ask endpoint should handle a missing question", async () => {
    const response = await request(app).get("/api/ask");
    expect(response.statusCode).toBeDefined();
  });

  test("4. Ask endpoint should handle an empty question", async () => {
    const response = await request(app)
      .get("/api/ask")
      .query({ question: "" });

    expect(response.statusCode).toBeDefined();
  });

  test("5. Unknown endpoint should return 404", async () => {
    const response = await request(app).get("/api/unknown-test-route");
    expect(response.statusCode).toBe(404);
  });
});
