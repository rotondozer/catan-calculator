import SumType from "sums-up";

class BuildOption extends SumType<{
  Settlement: [];
  City: [];
  DevCard: [];
  Road: [];
  None: [];
}> {}

function Road(): BuildOption {
  return new BuildOption("Road");
}
function Settlement(): BuildOption {
  return new BuildOption("Settlement");
}
function City(): BuildOption {
  return new BuildOption("City");
}
function DevCard(): BuildOption {
  return new BuildOption("DevCard");
}
function None(): BuildOption {
  return new BuildOption("None");
}

class TryBuild extends SumType<{ Success: []; Failure: [] }> {}

interface Hand {
  wheat: number;
  wood: number;
  brick: number;
  ore: number;
  sheep: number;
}
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

function newHand(overwrites: Partial<Hand> = {}): Hand {
  return {
    wheat: 0,
    wood: 0,
    brick: 0,
    ore: 0,
    sheep: 0,
    ...overwrites,
  };
}

function buildRoad(hand: Hand): Hand {
  const currentBrick = hand.brick;
  const currentWood = hand.wood;
  return { ...hand, brick: currentBrick - 1, wood: currentWood - 1 };
}

function canBuildRoad(hand: Hand): boolean {
  return hand.brick >= 1 && hand.wood >= 1;
}

function evaluateScenario({ hand }: TestScenario): [BuildOption] {
  console.log("TODO: evaluateScenario", hand);
  if (canBuildRoad(hand)) {
    const updatedHand = buildRoad(hand);
    return [Road()];
  }
  return [None()];
}

evaluateScenario(testScenario);
