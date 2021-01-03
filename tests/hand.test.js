const { Result, Ok, Err } = require("seidr");
const { Hand, buildMax } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build-option");
const { BuildQueue } = require("../build/build-queue");

const EMPTY_HAND = { wheat: 0, wood: 0, brick: 0, sheep: 0, ore: 0 };

describe("Hand", () => {
  describe("constructor()", () => {
    test("with a string (for Err)", () => {
      expect(new Hand("barf").show()).toEqual(Err("barf"));
    });
    test("with a partial hand (Ok)", () => {
      expect(new Hand({ ore: 10 }).show()).toEqual(Ok({ ...EMPTY_HAND, ore: 10 }));
    });
    test("with no parameters (Ok)", () => {
      expect(new Hand().show()).toEqual(Ok(EMPTY_HAND));
    });
    it("handles negative numbers by initiating an Err hand", () => {
      const invalidHand = new Hand({ wheat: -1 });
      expect(invalidHand.show()).toEqual(Err("negative resources"));
    });
  });

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

  describe("remove()", () => {
    it("returns the Hand if in an Err state", () => {
      const errHand = new Hand("boogers");
      expect(errHand.remove(1, "wheat").show()).toEqual(Err("boogers"));
    });
    it("removes n resources if available", () => {
      const okHand = new Hand({ ore: 3, wheat: 2 });
      expect(okHand.remove(3, "ore").remove(2, "wheat").show()).toEqual(Ok(EMPTY_HAND));
    });
    it("returns an Err hand if the resource being removed would end up as a negative num", () => {
      const okHand = new Hand({ ore: 3, wheat: 1 });
      expect(okHand.remove(3, "ore").remove(2, "wheat").show()).toEqual(Err("insufficient wheat"));
    });
  });

  describe("add()", () => {
    it("returns the Hand if the hand is Err", () => {
      const errHand = new Hand("butts").add(1, "brick");
      expect(errHand).toEqual(errHand);
    });
    it("adds the resource if the Hand is Ok", () => {
      const okHand = new Hand().add(1, "brick");
      expect(okHand).toEqual(new Hand({ brick: 1 }));
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
