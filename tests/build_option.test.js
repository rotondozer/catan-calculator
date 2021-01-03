const BuildOption = require("../build/build_option");

test("things", () => {
  expect(BuildOption.None()).not.toBeNull();
});
