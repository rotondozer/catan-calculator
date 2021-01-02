const { Result, Ok, Err } = require("seidr");
const { Hand, buildMax } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build-option");
const { BuildQueue } = require("../build/build-queue");

describe("Hand", () => {
  describe("payFor()", () => {
    const emptyHand = new Hand();
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

  describe("buildMax", () => {
    let count;
    beforeEach(() => {
      count = new BuildQueue();
    });
    test("basic", () => {
      const hand = new Hand({ wood: 10, brick: 10 });
      expect(buildMax(Road(1), { hand, count })).toEqual({ count: new BuildQueue([Road(10)]), hand: new Hand() });
    });
    test("with leftovers", () => {
      const hand = new Hand({ wood: 11, brick: 10 });
      expect(buildMax(Road(1), { hand, count })).toEqual({
        count: new BuildQueue([Road(10)]),
        hand: new Hand({ wood: 1 }),
      });
    });
  });
});
