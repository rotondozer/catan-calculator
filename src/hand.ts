import { BuildOption, City, Road, Settlement, DevCard, None } from "./build-option";
import { Result, Ok, Err, Maybe } from "seidr";
import { BuildCounter } from "./build-counter";

type Error = string;

export interface IHand {
  wheat: number;
  wood: number;
  brick: number;
  ore: number;
  sheep: number;
}

class Hand {
  hand: Result<Error, IHand>; // do I assume this is always in a valid state?

  constructor(t?: IHand | Error) {
    if (t) {
      this.hand = this.isHand(t) ? Ok(t) : Err(t);
    } else {
      this.hand = Ok(this.init());
    }
  }

  private isHand(t: IHand | Error): t is IHand {
    return (t as IHand).brick !== undefined;
  }

  private init(overwrites: Partial<IHand> = {}): IHand {
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

  public payFor(buildOption: BuildOption): Hand {
    return buildOption.caseOf({
      None: () => this,
      Road: () => this.remove(1, "brick").remove(1, "wood"),
      Settlement: () => this.remove(1, "sheep").remove(1, "wheat").remove(1, "brick").remove(1, "wood"),
      City: () => this.remove(3, "ore").remove(2, "wheat"),
      DevCard: () => this.remove(1, "wheat").remove(1, "sheep").remove(1, "ore"),
    });
  }

  public remove(n: number, key: keyof IHand): Hand {
    return this.hand.caseOf({
      Err: e => new Hand(e),
      Ok: h => {
        const result = h[key] - n;
        return result < 0 ? new Hand(`insufficient ${key}`) : new Hand({ ...h, [key]: result });
      },
    });
  }
}

const EMPTY_HAND: IHand = {
  wheat: 0,
  wood: 0,
  brick: 0,
  ore: 0,
  sheep: 0,
};

export function newHand(overwrites: Partial<IHand> = {}): IHand {
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

export function payFor(buildOption: BuildOption, h: IHand): Result<Error, IHand> {
  const hand = new Hand(h);
  return buildOption.caseOf({
    None: () => Err("None"),
    Road: () => hand.remove(1, "brick").remove(1, "wood").hand,
    Settlement: () => hand.remove(1, "sheep").remove(1, "wheat").remove(1, "brick").remove(1, "wood").hand,
    City: () => hand.remove(3, "ore").remove(2, "wheat").hand,
    DevCard: () => hand.remove(1, "wheat").remove(1, "sheep").remove(1, "ore").hand,
  });
}

function canBuild(buildOption: BuildOption, h: IHand): boolean {
  const has = (n: number, k: keyof IHand) => h[k] >= n;

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
  hand: IHand;
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
