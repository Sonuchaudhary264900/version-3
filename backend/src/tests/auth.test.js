/**
 * Auth Tests
 * Tests OTP authentication system
 */

const request = require("supertest");
const app = require("../src/app");

describe("Auth API Tests", () => {

  let phone = "9876543210";
  let otp = "123456";
  let token = "";



  /**
   * Test send OTP
   */
  describe("POST /api/auth/send-otp", () => {

    it("should send OTP successfully", async () => {

      const res = await request(app)
        .post("/api/auth/send-otp")
        .send({ phone });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

    });

  });



  /**
   * Test verify OTP
   */
  describe("POST /api/auth/verify-otp", () => {

    it("should verify OTP and return token", async () => {

      const res = await request(app)
        .post("/api/auth/verify-otp")
        .send({
          phone,
          otp
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();

      token = res.body.token;

    });

  });



  /**
   * Test protected route
   */
  describe("GET /api/auth/me", () => {

    it("should return user profile", async () => {

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();

    });

  });



  /**
   * Test logout
   */
  describe("POST /api/auth/logout", () => {

    it("should logout user successfully", async () => {

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

    });

  });

});