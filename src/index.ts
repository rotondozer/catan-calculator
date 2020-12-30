import SumType from "sums-up";
import { Hand, hasAtLeast, payForRoad, canBuildRoad, remove } from "./hand";
import * as BuildOption from "./build-option";

class TryBuild extends SumType<{ Success: []; Failure: [] }> {}

interface TestScenario {
  hand: Hand;
}
const testScenario: TestScenario = {
  hand: {
    wheat: 0,
    wood: 0,
    brick: 0,
    ore: 0,
    sheep: 0,
  },
  // devCards, ports, etc. ...
};

function canBuild(buildOption: BuildOption.BuildOption, h: Hand): boolean {
  const has = (n: number, k: keyof Hand) => hasAtLeast(n, k, h);

  return buildOption.caseOf({
    Road: () => has(1, "brick") && has(1, "wood"),
    Settlement: () => has(1, "brick") && has(1, "wheat") && has(1, "wood") && has(1, "sheep"),
    DevCard: () => has(1, "wheat") && has(1, "ore") && has(1, "sheep"),
    City: () => has(2, "wheat") && has(3, "ore"),
    None: () => false, // TODO
  });
}

function evaluateScenario({ hand }: TestScenario): Array<BuildOption.BuildOption> {
  console.log("TODO: evaluateScenario", hand);

  return getAllBuildOptions(hand);
}

const BUILD_OPTS = [BuildOption.City(), BuildOption.DevCard(), BuildOption.Road(), BuildOption.Settlement()];

function getAllBuildOptions(hand: Hand): Array<BuildOption.BuildOption> {
  const buildOpts = BUILD_OPTS.filter(opt => canBuild(opt, hand));

  if (buildOpts.length === 0) return [BuildOption.None()];
  else return buildOpts;
}

export { build };
