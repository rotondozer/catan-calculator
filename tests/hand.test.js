const { Result, Ok, Err } = require("seidr");
const { payFor, newHand } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build-option");

describe("hand", () => {
  const emptyHand = Ok(newHand());
  describe("payFor", () => {
    test("None", () => {
      expect(payFor(None(), {})).toEqual(Err("None"));
    });
    test("City", () => {
      expect(payFor(City(), newHand({ ore: 3, wheat: 2 }))).toEqual(emptyHand);
    });
    test("Road", () => {
      expect(payFor(Road(), newHand({ brick: 1, wood: 1 }))).toEqual(emptyHand);
    });
    test("Settlement", () => {
      expect(payFor(Settlement(), newHand({ brick: 1, wood: 1, sheep: 1, wheat: 1 }))).toEqual(emptyHand);
    });
    test("DevCard", () => {
      expect(payFor(DevCard(), newHand({ ore: 1, wheat: 1, sheep: 1 }))).toEqual(emptyHand);
    });
  });
});
