import { stripText } from "./string";

describe("Test string utils", () => {
  it("should return itself when input is empty", () => {
    const result = stripText("", 10);
    expect(result).toHaveLength(0);
  });

  it("should return itself when input is shorter than length", () => {
    const result = stripText("something", 20);
    expect(result).toBe("something");
  });

  it("should return expect result when input long data", () => {
    const result = stripText("something", 3);
    expect(result).toHaveLength(6);
  });
});
