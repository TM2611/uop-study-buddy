import * as utils from "../utils";
import { days } from "../constants";
import * as mocks from "./__mocks__/utils.mock";

describe("convertDMYToYMD", () => {
  it("should convert a date string to YMD format", () => {
    const testCases = [
      { input: "01/01/2024", expected: "2024-01-01" },
      { input: "02/01/2024", expected: "2024-01-02" },
      { input: "03/01/2024", expected: "2024-01-03" },
      { input: "04/01/2024", expected: "2024-01-04" },
      { input: "05/01/2024", expected: "2024-01-05" },
      { input: "06/01/2024", expected: "2024-01-06" },
      { input: "07/01/2024", expected: "2024-01-07" },
      { input: "01-01-2024", expected: "2024-01-01" },
      { input: "02-01-2024", expected: "2024-01-02" },
      { input: "03-01-2024", expected: "2024-01-03" },
      { input: "04-01-2024", expected: "2024-01-04" },
      { input: "05-01-2024", expected: "2024-01-05" },
      { input: "06-01-2024", expected: "2024-01-06" },
      { input: "07-01-2024", expected: "2024-01-07" },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.convertDMYToYMD(input);
      expect(result).toBe(expected);
    });
  });
});

describe("createDateFromDMY", () => {
  it("should create a date object from a valid date string", () => {
    const testCases = [
      { input: "01/01/2024", expected: new Date(2024, 0, 1) },
      { input: "02/01/2024", expected: new Date(2024, 0, 2) },
      { input: "03/01/2024", expected: new Date(2024, 0, 3) },
      { input: "04/01/2024", expected: new Date(2024, 0, 4) },
      { input: "05/01/2024", expected: new Date(2024, 0, 5) },
      { input: "06/01/2024", expected: new Date(2024, 0, 6) },
      { input: "07/01/2024", expected: new Date(2024, 0, 7) },
      { input: "01-01-2024", expected: new Date(2024, 0, 1) },
      { input: "02-01-2024", expected: new Date(2024, 0, 2) },
      { input: "03-01-2024", expected: new Date(2024, 0, 3) },
      { input: "04-01-2024", expected: new Date(2024, 0, 4) },
      { input: "05-01-2024", expected: new Date(2024, 0, 5) },
      { input: "06-01-2024", expected: new Date(2024, 0, 6) },
      { input: "07-01-2024", expected: new Date(2024, 0, 7) },
      { input: "13-01-2024", expected: new Date(2024, 0, 13) },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.createDateFromDMY(input);
      expect(result).toEqual(expected);
    });
  });

  it("should return 'Invalid date' for an invalid date string", () => {
    const invalidDateString = "invalid-date";
    const result = utils.createDateFromDMY(invalidDateString);
    expect(result).toBe("Invalid date");
  });
});

describe("isDateInRange", () => {
  it("should return true for a date within the range", () => {
    const startOfWeek = "2024-01-01 00:00:00";
    const testCases = [
      { input: "2024-01-01", expected: true },
      { input: "2024-01-02", expected: true },
      { input: "2024-01-03", expected: true },
      { input: "2024-01-04", expected: true },
      { input: "2024-01-05", expected: true },
      { input: "2024-01-06", expected: true },
      { input: "2024-01-07", expected: true },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.isDateInRange(input, startOfWeek);
      expect(result).toBe(expected);
    });
  });

  it("should return false for a date outside the range", () => {
    const startOfWeek = "2024-01-01 00:00:00";
    const testCases = [
      { input: "2023-12-31", expected: false },
      { input: "2024-01-08", expected: false },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.isDateInRange(input, startOfWeek);
      expect(result).toBe(expected);
    });
  });

  it("should return 'Invalid date' for an invalid date string", () => {
    const invalidDateString = "invalid-date";
    const startOfWeek = "2024-01-01 00:00:00";
    const result = utils.isDateInRange(invalidDateString, startOfWeek);
    expect(result).toBe("Invalid date");
  });
});

describe("getDayFromDateStr", () => {
  it("should return the correct day name for a given date string", () => {
    const testCases = [
      { input: "2024-01-01", expected: days[0] },
      { input: "2024-01-02", expected: days[1] },
      { input: "2024-01-03", expected: days[2] },
      { input: "2024-01-04", expected: days[3] },
      { input: "2024-01-05", expected: days[4] },
      { input: "2024-01-06", expected: days[5] },
      { input: "2024-01-07", expected: days[6] },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.getDayFromDateStr(input);
      expect(result).toBe(expected);
    });
  });

  it("should return 'Invalid Date' for an invalid date string", () => {
    const invalidDateString = "invalid-date";
    const result = utils.getDayFromDateStr(invalidDateString);
    expect(result).toBe("Invalid Date");
  });
});

describe("extractUpNum", () => {
  it("should extract the upNum from an email", () => {
    const testCases = [
      { input: "up938751@myport.ac.uk", expected: "938751" },
      { input: "up932481@myport.ac.uk", expected: "932481" },
      { input: "up932481@myport.ac.uk", expected: "932481" },
      { input: "up923876@myport.ac.uk", expected: "923876" },
      { input: "up984245@myport.ac.uk", expected: "984245" },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = utils.extractUpNum(input);
      expect(result).toBe(expected);
    });
  });
});
describe("weeklyStatesToSelectedSlots", () => {
  it("should convert WeeklySlotStates to AvailabilitySlot[]", () => {
    mocks.weeklyStatesToSelectedSlots.forEach(({ input, expected }) => {
      const result = utils.weeklyStatesToSelectedSlots(input);
      expect(result).toEqual(expected);
    });
  });
});

describe("getBookedSlotIndexes", () => {
  it("should return the correct booked slot indexes", () => {
    mocks.getBookedSlotIndexes.forEach(({ input, expected }) => {
      const result = utils.getBookedSlotIndexes(input);
      expect(result).toEqual(expected);
    });
  });
});

describe("availabilitySlotsToStates", () => {
  it("should convert AvailabilitySlot[] to WeeklySlotStates", () => {
    mocks.availabilitySlotsToStates.forEach(({ input, expected }) => {
      const result = utils.availabilitySlotsToStates(input);
      expect(result).toEqual(expected);
    });
  });
});

//describe("availabilitySlotsToStates")
//describe("getBookedSlotIndexes")
