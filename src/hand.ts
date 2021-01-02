import { BuildOption } from "./build-option";
import { Result, Ok, Err } from "seidr";
import { BuildQueue } from "./build-queue";

type Error = string;

export interface IHand {
  wheat: number;
  wood: number;
  brick: number;
  ore: number;
  sheep: number;
}

export class Hand {
  hand: Result<Error, IHand>;

  constructor(t?: Partial<IHand> | Error) {
    if (t) {
      this.hand = this.isErr(t) ? Err(t) : Ok(this.init(t));
    } else {
      this.hand = Ok(this.init());
    }
  }

  private isErr(t: Partial<IHand> | Error): t is Error {
    return typeof t === "string";
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

  /**
   * sorta like a Maybe.getOrElse, but with a set default
   */
  public showOrEmpty(defaults?: IHand): IHand {
    return this.hand.caseOf({
      Err: err => {
        console.warn("Calling `show` on Err hand", err);
        return defaults || EMPTY_HAND;
      },
      Ok: h => h,
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
  count: BuildQueue;
  hand: Hand;
}
/**
 * Recursively keep building the same thing until the hand is empty.
 */
export function buildMax(buildOpt: BuildOption, buildResult: BuildResult): BuildResult {
  return buildResult.hand.payFor(buildOpt).hand.caseOf({
    Err: err => {
      console.log("buildMax tapping out with", err);
      return buildResult;
    },
    Ok: h => buildMax(buildOpt, { hand: new Hand(h), count: buildResult.count.add(buildOpt) }),
  });
}
