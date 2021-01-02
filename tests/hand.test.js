const { Result, Ok, Err } = require("seidr");
const { Hand, buildMax } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build-option");
const { BuildCounter } = require("../build/build-counter");

describe("Hand", () => {
  describe("payFor()", () => {
    test("None", () => {
      expect(new Hand().payFor(None())).toEqual(emptyHand);
    });
    test("City", () => {
      const hand = new Hand({ ore: 3, wheat: 2 });
      expect(hand.payFor(City(1))).toEqual(emptyHand);
    });
    test("Road", () => {
      const hand = new Hand({ brick: 1, wood: 1 });
      expect(hand.payFor(Road(1))).toEqual(emptyHand);
    });
    test("Settlement", () => {
      const hand = new Hand({ brick: 1, wood: 1, sheep: 1, wheat: 1 });
      expect(hand.payFor(Settlement(1))).toEqual(emptyHand);
    });
    test("DevCard", () => {
      const hand = new Hand({ ore: 1, wheat: 1, sheep: 1 });
      expect(hand.payFor(DevCard(1))).toEqual(emptyHand);
    });
  });

  describe.skip("buildMax", () => {
    let count;
    beforeEach(() => {
      count = new BuildCounter();
    });
    test("basic", () => {
      const hand = new Hand({ wood: 10, brick: 10 });
      expect(buildMax(Road(), { hand, count })).toEqual({ count: new BuildCounter([Road(10)]), hand: new Hand() });
    });
    test("with leftovers", () => {
      const hand = new Hand({ wood: 11, brick: 10 });
      expect(buildMax(Road(), { hand, count })).toEqual({
        count: expect.any(BuildCounter),
        hand: new Hand({ wood: 1 }),
      });
    });
  });
});
