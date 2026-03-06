const request = require("supertest");
const app = require("../../src/app");

describe("Authentication API", () => {

  it("should return error if phone number is missing", async () => {

    const res = await request(app)
      .post("/api/auth/send-otp")
      .send({});

    expect(res.statusCode).toBe(400);

  });

});