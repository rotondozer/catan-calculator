const { BuildCounter } = require("../build/build-counter");
const { BuildOption, Road } = require("../build/build-option");

describe("build count", () => {
  test("constuction paper", () => {
    expect(new BuildCounter().build).toEqual(new Set());
    expect(new BuildCounter(new Set([Road()])).build).toEqual(new Set([Road()]));
  });
  test("addToBuildCount", () => {
    expect(new BuildCounter().add(Road(1)).build).toEqual(new Set([Road(1)]));
  });
});
