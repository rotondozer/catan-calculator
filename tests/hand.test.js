const { Result, Ok, Err } = require("seidr");
const { Hand, buildMax } = require("../build/hand");
const { City, Road, Settlement, DevCard, None } = require("../build/build_option");
const { BuildQueue } = require("../build/build_queue");

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

    describe("with qty === 0", () => {
      const bigHand = new Hand({ ore: 20, wheat: 20, brick: 20, wood: 20, sheep: 20 });
      it("returns the Hand unchanged", () => {
        expect(bigHand.payFor(City())).toEqual(bigHand);
        expect(bigHand.payFor(Settlement(0))).toEqual(bigHand);
        expect(bigHand.payFor(Road())).toEqual(bigHand);
        expect(bigHand.payFor(DevCard(0))).toEqual(bigHand);
      });
    })

    describe("with qty === 1", () => {
      test("errors if insufficient resources", () => {
        const hand = new Hand({ ore: 2, wheat: 2 });
        expect(hand.payFor(City(1))).toEqual(new Hand("insufficient ore"));
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
    })
    
    describe("wih qty > 1", () => {
      test("Err building City if insufficient wheat", () => {
        const hand = new Hand({ ore: 9, wheat: 5 });
        expect(hand.payFor(City(3))).toEqual(new Hand("insufficient wheat"));
      })
      test("Err building Settlement if insufficient wood", () => {
        const hand = new Hand({ brick: 2, wood: 1, sheep: 2, wheat: 2 });
        expect(hand.payFor(Settlement(2))).toEqual(new Hand("insufficient wood"));
      })
      test("City", () => {
        const hand = new Hand({ ore: 12, wheat: 8 });
        expect(hand.payFor(City(4))).toEqual(emptyHand);
      });
      test("Road", () => {
        const hand = new Hand({ brick: 5, wood: 5 });
        expect(hand.payFor(Road(5))).toEqual(emptyHand);
      });
      test("Settlement", () => {
        const hand = new Hand({ brick: 2, wood: 2, sheep: 2, wheat: 2 });
        expect(hand.payFor(Settlement(2))).toEqual(emptyHand);
      });
      test("DevCard", () => {
        const hand = new Hand({ ore: 1, wheat: 1, sheep: 1 });
        expect(hand.payFor(DevCard(1))).toEqual(emptyHand);
      });
    })
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

  describe("bankTrade()", () => {
    test.todo("with ports");
    test("Err if insufficient resources", () => {
      const hand = new Hand({ sheep: 3 })
      expect(hand.bankTrade("sheep", "wood")).toEqual(new Hand("insufficient sheep"));
    });
    test("Sheep @ default trade rates w/ leftover", () => {
      const hand = new Hand({ sheep: 5 })
      expect(hand.bankTrade("sheep", "wood")).toEqual(new Hand({ sheep: 1, wood: 1 }));
    });
    test("Sheep @ default trade rates", () => {
      const hand = new Hand({ sheep: 4 })
      expect(hand.bankTrade("sheep", "wood")).toEqual(new Hand({ sheep: 0, wood: 1 }));
    });
  })

  describe("buildMax", () => {
    let queue;
    beforeEach(() => {
      queue = [];
    });
    test("basic", () => {
      const hand = new Hand({ wood: 10, brick: 10 });
      expect(buildMax(Road(1), { hand, queue })).toEqual({ queue: [Road(10)], hand: new Hand() });
    });
    test("with leftovers", () => {
      const hand = new Hand({ wood: 11, brick: 10 });
      expect(buildMax(Road(1), { hand, queue })).toEqual({
        queue: [Road(10)],
        hand: new Hand({ wood: 1 }),
      });
    });
  });
});
