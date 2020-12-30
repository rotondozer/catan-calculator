const { sum, Wheat, Resource } = require("../build/resource");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("it makes a resource", () => {
  expect(Wheat(1)).toBeInstanceOf(Resource);
});
