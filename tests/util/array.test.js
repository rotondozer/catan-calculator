const { getRandomNumberBetween, interpose, insertRandomly } = require("../../build/util/array.js");

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

  describe("insertRandomly", () => {
    it("adds the element to the array without mutating the original 1", () => {
      const result1 = insertRandomly(1, Object.freeze([2, 3, 4, 5]))

      expect(result1).toHaveLength(5)
      expect(result1).toEqual(expect.arrayContaining([1]))
    })
    it("adds the element to the array without mutating the original 2", () => {
      const result2 = insertRandomly(2, Object.freeze([1, 3]))

      expect(result2).toHaveLength(3)
      expect(result2).toEqual(expect.arrayContaining([2]))
    })
    it("adds the element to the array without mutating the original 3", () => {
      const result3 = insertRandomly(3, Object.freeze([0]))

      expect(result3).toHaveLength(2)
      expect(result3).toEqual(expect.arrayContaining([3]))
    })
    it("adds the element to the array without mutating the original 4", () => {
      
      const result4 = insertRandomly(4, Object.freeze([1, 2, 5]))

      expect(result4).toHaveLength(4)
      expect(result4).toEqual(expect.arrayContaining([4]))
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
