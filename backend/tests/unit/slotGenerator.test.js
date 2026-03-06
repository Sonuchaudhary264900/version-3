const generateSlots = require("../../src/utils/generateSlots");

describe("Slot Generator", () => {

  it("should generate correct slots", () => {

    const slots = generateSlots("09:00", "10:00", 30);

    expect(slots.length).toBeGreaterThan(0);

  });

});