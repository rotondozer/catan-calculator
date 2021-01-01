const { Result, Ok, Err } = require("seidr");
const { payFor, newHand, buildMax } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build-option");
const { BuildCounter } = require("../build/build-counter");

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

  describe("buildMax", () => {
    let count;
    beforeEach(() => {
      count = new BuildCounter();
    });
    test("basic", () => {
      const hand = newHand({ wood: 10, brick: 10 });
      expect(buildMax(Road(), { hand, count })).toEqual({ count: expect.any(BuildCounter), hand: newHand() });
    });
    test("with leftovers", () => {
      const hand = newHand({ wood: 11, brick: 10 });
      expect(buildMax(Road(), { hand, count })).toEqual({
        count: expect.any(BuildCounter),
        hand: newHand({ wood: 1 }),
      });
    });
  });
});
