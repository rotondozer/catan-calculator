const { BuildCounter } = require("../build/build-counter");
const { BuildOption, Road } = require("../build/build-option");

describe("build count", () => {
  test("constuction paper", () => {
    expect(new BuildCounter().builds).toEqual([]);
    expect(new BuildCounter([Road()]).builds).toEqual([Road()]);
    expect(new BuildCounter([Road(1)]).builds).toEqual([Road(1)]);
  });
  test("adding to new BuildCounter instance", () => {
    expect(new BuildCounter().add(Road(1)).builds).toEqual([Road(1)]);
  });
  test("updating existing BuildCounter BuildOption", () => {
    expect(new BuildCounter([Road(1)]).add(Road(1)).builds).toEqual([Road(2)]);
  });
});
