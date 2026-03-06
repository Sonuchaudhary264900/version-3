/**
 * Salon Tests
 * Tests salon discovery APIs
 */

const request = require("supertest");
const app = require("../src/app");

let token = "";
let salonId = "testSalonId";

describe("Salon API Tests", () => {

  /**
   * Login before tests
   */
  beforeAll(async () => {

    const res = await request(app)
      .post("/api/auth/verify-otp")
      .send({
        phone: "9876543210",
        otp: "123456"
      });

    token = res.body.token;

  });



  /**
   * Test nearby salons
   */
  describe("GET /api/salons/nearby", () => {

    it("should return nearby salons", async () => {

      const res = await request(app)
        .get("/api/salons/nearby?lat=30.7333&lng=76.7794");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.salons)).toBe(true);

    });

  });



  /**
   * Test salon search
   */
  describe("GET /api/salons/search", () => {

    it("should return search results", async () => {

      const res = await request(app)
        .get("/api/salons/search?query=hair");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.salons)).toBe(true);

    });

  });



  /**
   * Test trending salons
   */
  describe("GET /api/salons/trending", () => {

    it("should return trending salons", async () => {

      const res = await request(app)
        .get("/api/salons/trending");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.salons)).toBe(true);

    });

  });



  /**
   * Test salon details
   */
  describe("GET /api/salons/:salonId", () => {

    it("should return salon details", async () => {

      const res = await request(app)
        .get(`/api/salons/${salonId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.salon).toBeDefined();

    });

  });



  /**
   * Test salon services
   */
  describe("GET /api/salons/:salonId/services", () => {

    it("should return salon services", async () => {

      const res = await request(app)
        .get(`/api/salons/${salonId}/services`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.services)).toBe(true);

    });

  });



  /**
   * Test salon reviews
   */
  describe("GET /api/salons/:salonId/reviews", () => {

    it("should return salon reviews", async () => {

      const res = await request(app)
        .get(`/api/salons/${salonId}/reviews`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.reviews)).toBe(true);

    });

  });



  /**
   * Test add favorite salon
   */
  describe("POST /api/salons/:salonId/favorite", () => {

    it("should add salon to favorites", async () => {

      const res = await request(app)
        .post(`/api/salons/${salonId}/favorite`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

    });

  });



  /**
   * Test remove favorite salon
   */
  describe("DELETE /api/salons/:salonId/favorite", () => {

    it("should remove salon from favorites", async () => {

      const res = await request(app)
        .delete(`/api/salons/${salonId}/favorite`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

    });

  });



  /**
   * Test get favorite salons
   */
  describe("GET /api/salons/user/favorites", () => {

    it("should return favorite salons", async () => {

      const res = await request(app)
        .get("/api/salons/user/favorites")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.salons)).toBe(true);

    });

  });

});