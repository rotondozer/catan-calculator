const BuildOption = require("../build/build-option");

test("things", () => {
  expect(BuildOption.None()).not.toBeNull();
});
