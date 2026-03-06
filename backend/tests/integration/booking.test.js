const request = require("supertest");
const app = require("../../src/app");

describe("Booking API", () => {

  it("should reject booking without authentication", async () => {

    const res = await request(app)
      .post("/api/bookings")
      .send({
        salonId: "123",
        serviceId: "123",
        bookingDate: "2026-03-10",
        slotStart: "10:00"
      });

    expect(res.statusCode).toBe(401);

  });

});