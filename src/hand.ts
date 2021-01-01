import { BuildOption, City, Road, Settlement, DevCard, None } from "./build-option";
import { Result, Ok, Err } from "seidr";
import { BuildCounter } from "./build-counter";

type Error = string;

export interface Hand {
  wheat: number;
  wood: number;
  brick: number;
  ore: number;
  sheep: number;
}

class Handy {
  hand: Result<Error, Hand>; // do I assume this is always in a valid state?

  constructor(h?: Result<Error, Hand>) {
    this.hand = h || Ok(newHand());
  }

  public static fromHand(h: Hand): Handy {
    return new Handy(Ok(h)); // TODO: validate here?
  }

  /**
   * show the hand after performing a series of actions to reveal
   * the Result type.
   */
  public getResult(): Result<Error, Hand> {
    return this.hand;
  }

  public remove(n: number, key: keyof Hand): Handy {
    return this.hand.caseOf({
      Err: e => new Handy(Err(e)),
      Ok: h => {
        const result = h[key] - n;
        return result < 0 ? new Handy(Err(`insufficient ${key}`)) : new Handy(Ok({ ...h, [key]: result }));
      },
    });
  }
}

const EMPTY_HAND: Hand = {
  wheat: 0,
  wood: 0,
  brick: 0,
  ore: 0,
  sheep: 0,
};

export function newHand(overwrites: Partial<Hand> = {}): Hand {
  // idk if this is necessary, just adding as many checks as possible.
  const hasInvalid = Object.values(overwrites).some(v => v && v < 0);
  if (hasInvalid) {
    console.warn("you done something wrong, overwrites include NEGATIVE NUMBERS");
    return EMPTY_HAND;
  }
  return {
    ...EMPTY_HAND,
    ...overwrites,
  };
}

export function payFor(buildOption: BuildOption, h: Hand): Result<Error, Hand> {
  const hand = Handy.fromHand(h);
  return buildOption.caseOf({
    None: () => Err("None"),
    Road: () => hand.remove(1, "brick").remove(1, "wood").getResult(),
    Settlement: () => hand.remove(1, "sheep").remove(1, "wheat").remove(1, "brick").remove(1, "wood").getResult(),
    City: () => hand.remove(3, "ore").remove(2, "wheat").getResult(),
    DevCard: () => hand.remove(1, "wheat").remove(1, "sheep").remove(1, "ore").getResult(),
  });
}

function hasAtLeast(n: number, key: keyof Hand, hand: Hand): boolean {
  return hand[key] >= n;
}

function remove(n: number, key: keyof Hand, hand: Hand): Result<Error, Hand> {
  const result = hand[key] - n;
  if (result < 0) {
    // TODO: resource type
    return Err(`Missing ${Math.abs(result)} ${hand[key]} resources`);
  } else {
    return Ok({ ...hand, [key]: result });
  }
}

function canBuild(buildOption: BuildOption, h: Hand): boolean {
  const has = (n: number, k: keyof Hand) => hasAtLeast(n, k, h);

  return buildOption.caseOf({
    Road: () => has(1, "brick") && has(1, "wood"),
    Settlement: () => has(1, "brick") && has(1, "wheat") && has(1, "wood") && has(1, "sheep"),
    DevCard: () => has(1, "wheat") && has(1, "ore") && has(1, "sheep"),
    City: () => has(2, "wheat") && has(3, "ore"),
    None: () => false, // TODO
  });
}

interface BuildResult {
  count: BuildCounter;
  hand: Hand;
}
/**
 * Recursively keep building the same thing until the hand is empty.
 */
export function buildMax(buildOpt: BuildOption, buildResult: BuildResult): BuildResult {
  const { hand, count } = buildResult;
  return payFor(buildOpt, hand).caseOf({
    Err: err => {
      console.log("buildMax tapping out with", err);
      return { hand, count };
    },
    Ok: hand => buildMax(buildOpt, { hand, count: count.add(buildOpt) }),
  });
}
