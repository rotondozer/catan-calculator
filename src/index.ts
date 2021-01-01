import { IHand } from "./hand";
import * as BuildOption from "./build-option";

interface TestScenario {
  hand: IHand;
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

function evaluateScenario({ hand }: TestScenario): Array<BuildOption.BuildOption> {
  console.log("TODO: evaluateScenario", hand);
  return [];
}

evaluateScenario(testScenario);
