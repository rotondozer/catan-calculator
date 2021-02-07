const { getRandomNumberBetween, interpose } = require("../../build/util/array.js");

describe("util", () => {
  describe("getRandomNumberBetween", () => {
    it("respects the constraints for a sample size of 8", () => {
      const results = [
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5),
        getRandomNumberBetween(1, 5)
      ];
      results.forEach(r => {
        expect(r <= 5).toBe(true);
        expect(r >= 1).toBe(true)
      })
    })
  });

  describe("interpose", () => {
    it("works", () => {
      expect(interpose([1, 3, 5], [2, 4])).toEqual([1, 2, 3, 4, 5])
    })
    it("handles wacky array lengths 1", () => {
      expect(interpose([1], [2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })
    it("handles wacky array lengths 2", () => {
      expect(interpose([1, 3, 4, 5], [2])).toEqual([1, 2, 3, 4, 5])
    })
    it("handles empties 1", () => {
      expect(interpose([], [1])).toEqual([1])
    })
    it("handles empties 2", () => {
      expect(interpose([1], [])).toEqual([1])
    })
    it("handles empties 3", () => {
      expect(interpose([], [])).toEqual([])
    })
  })
})
