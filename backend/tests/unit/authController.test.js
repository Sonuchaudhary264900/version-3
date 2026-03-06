jest.mock("../../src/services/otpService", () => ({
  createOTP: jest.fn(),
  clearOTP: jest.fn(),
  verifyOTP: jest.fn()
}));

jest.mock("../../src/services/smsService", () => ({
  sendOTP: jest.fn()
}));

jest.mock("../../src/models/User", () => ({}));

const otpService = require("../../src/services/otpService");
const smsService = require("../../src/services/smsService");
const authController = require("../../src/controllers/authController");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController.sendOTP", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes +91 formatted phone number before OTP creation", async () => {

    otpService.createOTP.mockReturnValue("111111");
    smsService.sendOTP.mockResolvedValue({ success: true });

    const req = {
      body: {
        phone: "+91 98765-43210"
      }
    };

    const res = mockRes();

    await authController.sendOTP(req, res, jest.fn());

    expect(otpService.createOTP).toHaveBeenCalledWith("9876543210");
    expect(smsService.sendOTP).toHaveBeenCalledWith("9876543210", "111111");
    expect(res.status).toHaveBeenCalledWith(200);

  });

  it("returns 502 and clears OTP when SMS provider fails", async () => {

    otpService.createOTP.mockReturnValue("222222");
    smsService.sendOTP.mockResolvedValue({ success: false, error: "provider down" });

    const req = {
      body: {
        phone: "9876543210"
      }
    };

    const res = mockRes();

    await authController.sendOTP(req, res, jest.fn());

    expect(otpService.clearOTP).toHaveBeenCalledWith("9876543210");
    expect(res.status).toHaveBeenCalledWith(502);

  });

});
