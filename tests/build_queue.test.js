const { add, combineAdjacents } = require("../build/build_queue");
const { Road, City, Settlement } = require("../build/build_option");

describe("BuildQueue", () => {
  describe("combineAdjacents()", () => {
    test("one and zero BuildOptions work as expected", () => {
      expect(combineAdjacents([Road(1)])).toEqual([Road(1)]);
      expect(combineAdjacents([])).toEqual([]);
    });

    test("several BuildOptions work as expected", () => {
      const buildOpts = combineAdjacents([Road(1), City(3)]);
      expect(buildOpts).toEqual([Road(1), City(3)]);
    });

    test("from several BuildOptions with dupes", () => {
      const buildOpts = combineAdjacents([
        Road(1),
        Road(1),
        City(3),
        Road(2),
        Settlement(1),
        Settlement(3),
        City(1),
        Settlement(10),
      ]);
      expect(buildOpts).toEqual([Road(2), City(3), Road(2), Settlement(4), City(1), Settlement(10)]);
    });
  });

  describe("add()", () => {
    let queue;
    beforeEach(() => {
      queue = [];
    });

    it("adds to an empty queue", () => {
      expect(add(Road(1), queue)).toEqual([Road(1)]);
    });

    describe("when adding a dupe buildOpt right behind it's pal", () => {
      test("adding buildOpt === 1", () => {
        queue = [Road(1)];
        expect(add(Road(1), queue)).toEqual([Road(2)]);
      });
      test("adding buildOpt > 1", () => {
        queue = [Road(2)];
        expect(add(Road(1), queue)).toEqual([Road(3)]);
        expect(add(Road(5), queue)).toEqual([Road(7)])
      });
      it("doesn't combine dupes if they're not adjacent in the queue", () => {
        queue = [Road(2), City(2)];
        expect(add(Road(1), queue)).toEqual([Road(2), City(2), Road(1)]);
        expect(add(Road(3), queue)).toEqual([Road(2), City(2), Road(3)]);
      });
    });
  });
});
