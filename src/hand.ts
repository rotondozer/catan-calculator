import * as BuildOption from "./build-option";

export interface Hand {
  wheat: number;
  wood: number;
  brick: number;
  ore: number;
  sheep: number;
}

export function newHand(overwrites: Partial<Hand> = {}): Hand {
  return {
    wheat: 0,
    wood: 0,
    brick: 0,
    ore: 0,
    sheep: 0,
    ...overwrites,
  };
}

export function payForRoad(hand: Hand): Hand {
  const currentBrick = hand.brick;
  const currentWood = hand.wood;
  return { ...hand, brick: currentBrick - 1, wood: currentWood - 1 };
}

export function canBuildRoad(hand: Hand): boolean {
  return hand.brick >= 1 && hand.wood >= 1;
}

export function hasAtLeast(n: number, key: keyof Hand, hand: Hand): boolean {
  return hand[key] >= n;
}

export function remove(n: number, key: keyof Hand, hand: Hand): Hand {
  return { ...hand, [key]: hand[key] - n };
}

export function build(hand: Hand, buildOption: BuildOption.BuildOption = BuildOption.None()): Hand {
  const x = buildOption.caseOf({
    None: () => hand,
    Road: () => remove(1, "wood", remove(1, "brick", hand)),
    Settlement: () => remove(1, "sheep", remove(1, "wheat", remove(1, "brick", remove(1, "wood", hand)))),
    City: () => remove(3, "ore", remove(2, "wheat", hand)),
    DevCard: () => remove(1, "wheat", remove(1, "sheep", remove(1, "ore", hand))),
  });
  console.log("------ X ------ ", x);
  return x;
}

export { BuildOption };
