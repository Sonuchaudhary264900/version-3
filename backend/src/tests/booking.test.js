/**
 * Booking Tests
 * Tests booking engine APIs
 */

const request = require("supertest");
const app = require("../src/app");

let token = "";
let bookingId = "";
let salonId = "testSalonId";
let serviceId = "testServiceId";


describe("Booking API Tests", () => {

  /**
   * Mock login to get token
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
   * Test slot availability
   */
  describe("GET /api/bookings/slots/:salonId", () => {

    it("should return available slots", async () => {

      const res = await request(app)
        .get(`/api/bookings/slots/${salonId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

    });

  });



  /**
   * Test booking creation
   */
  describe("POST /api/bookings", () => {

    it("should create a new booking", async () => {

      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          salonId,
          serviceId,
          date: "2026-04-10",
          startTime: "10:00"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.booking).toBeDefined();

      bookingId = res.body.booking._id;

    });

  });



  /**
   * Test get booking details
   */
  describe("GET /api/bookings/:bookingId", () => {

    it("should return booking details", async () => {

      const res = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.booking).toBeDefined();

    });

  });



  /**
   * Test get user bookings
   */
  describe("GET /api/bookings/my-bookings", () => {

    it("should return user booking history", async () => {

      const res = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.bookings)).toBe(true);

    });

  });



  /**
   * Test booking cancellation
   */
  describe("PATCH /api/bookings/:bookingId/cancel", () => {

    it("should cancel a booking", async () => {

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.booking.status).toBe("cancelled");

    });

  });



  /**
   * Test owner confirming booking
   */
  describe("PATCH /api/bookings/owner/:bookingId/confirm", () => {

    it("should confirm booking", async () => {

      const res = await request(app)
        .patch(`/api/bookings/owner/${bookingId}/confirm`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

    });

  });



  /**
   * Test completing booking
   */
  describe("PATCH /api/bookings/owner/:bookingId/complete", () => {

    it("should complete booking", async () => {

      const res = await request(app)
        .patch(`/api/bookings/owner/${bookingId}/complete`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

    });

  });

});