const { BuildQueue } = require("../build/build-queue");
const { Road, City, Settlement } = require("../build/build-option");

describe("BuildQueue", () => {
  describe("constructor()", () => {
    it("handles empties", () => {
      expect(new BuildQueue().queue).toEqual([]);
      expect(new BuildQueue([]).queue).toEqual([]);
    });

    it("constructs a queue from one item", () => {
      expect(new BuildQueue([Road(1)]).queue).toEqual([Road(1)]);
    });

    it("constructs a queue from several items", () => {
      const thing = new BuildQueue([Road(1), City(3)]);
      expect(thing.queue).toEqual([Road(1), City(3)]);
    });

    it("constructs a queue from several items with dupes", () => {
      const thing = new BuildQueue([
        Road(1),
        Road(1),
        City(3),
        Road(2),
        Settlement(1),
        Settlement(3),
        City(1),
        Settlement(10),
      ]);
      console.log("THING", thing.queue);
      expect(thing.queue).toEqual([Road(2), City(3), Road(2), Settlement(4), City(1), Settlement(10)]);
    });
  });

  describe("add()", () => {
    let queue;
    beforeEach(() => {
      queue = new BuildQueue();
    });

    it("adds to an empty queue", () => {
      expect(queue.add(Road(1)).queue).toEqual([Road(1)]);
    });

    describe("when adding a dupe buildOpt right behind it's pal", () => {
      it("combines them", () => {
        expect(queue.add(Road(1)).add(Road(1)).queue).toEqual([Road(2)]);
      });
      it("and again", () => {
        expect(queue.add(Road(1)).add(Road(1)).add(Road(1)).queue).toEqual([Road(3)]);
      });
      it("doesn't combine dupes if they're not adjacent in the queue", () => {
        expect(queue.add(Road(1)).add(Road(1)).add(City(2)).add(Road(1)).queue).toEqual([Road(2), City(2), Road(1)]);
      });
    });
  });
});
