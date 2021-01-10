import { BuildOption } from "./build_option";
import { Result, Ok, Err } from "seidr";
import * as BuildQueue from "./build_queue";

type Error = string;
// TODO: get rid of Resource sumType?
type Resource = keyof IHand;

export interface IHand {
	wheat: number;
	wood: number;
	brick: number;
	ore: number;
	sheep: number;
}
const EMPTY_HAND: IHand = {
  wheat: 0,
  wood: 0, 
  brick: 0,
  ore: 0,
  sheep: 0,
};

export class Hand {
	private _hand: Result<Error, IHand>;

	constructor(t?: Partial<IHand> | Error) {
	  this._hand = isErr(t) ? Err(t) : this.initHand(t);
	}

	private initHand(overwrites: Partial<IHand> = {}): Result<Error, IHand> {
	  if (hasNegativeNums(overwrites)) {
	    return Err("negative resources");
	  } else {
	    return Ok({ ...EMPTY_HAND, ...overwrites });
	  }
	}

	public bankTrade(resourceOut: Resource, resourceIn: Resource): Hand {
	  // get trade rate (adjust for ports)
	  return this.remove(4, resourceOut).add(1, resourceIn);
	}

	public payFor(buildOption: BuildOption): Hand {
	  return buildOption.caseOf({
	    None: () => this,
	    Road: (qty) => this.remove(qty * 1, "brick").remove(qty * 1, "wood"),
	    Settlement: (qty) =>
	      this.remove(qty * 1, "sheep")
	        .remove(qty * 1, "wheat")
	        .remove(qty * 1, "brick")
	        .remove(qty * 1, "wood"),
	    City: (qty) => this.remove(qty * 3, "ore").remove(qty * 2, "wheat"),
	    DevCard: (qty) =>
	      this.remove(qty * 1, "wheat").remove(qty * 1, "sheep").remove(qty * 1, "ore"),
	  });
	}

	public add(n: number, resource: keyof IHand): Hand {
	  return this._hand.caseOf({
	    Err: () => this,
	    Ok: (hand) => new Hand({ ...hand, [resource]: hand[resource] + n }),
	  });
	}

	public remove(n: number, resource: keyof IHand): Hand {
	  return this._hand.caseOf({
	    Err: (e) => new Hand(e),
	    Ok: (hand) => {
	      const result = hand[resource] - n;
	      return result < 0
	        ? new Hand(`insufficient ${resource}`)
	        : new Hand({ ...hand, [resource]: result });
	    },
	  });
	}

	/** reveal the Result hand */
	public show(): Result<Error, IHand> {
	  return this._hand;
	}

	/** sorta like a Maybe.getOrElse, but with a set default */
	public showOrEmpty(defaults?: IHand): IHand {
	  return this._hand.caseOf({
	    Err: (err) => {
	      console.warn("Calling `show` on Err hand", err);
	      return defaults || EMPTY_HAND;
	    },
	    Ok: (h) => h,
	  });
	}
}

function isErr(t?: Partial<IHand> | Error): t is Error {
  return typeof t === "string";
}

/** invalid if any negative numbers */
function hasNegativeNums(hand: Partial<IHand>): boolean {
  return Object.values(hand).some((v) => v && v < 0);
}

interface BuildResult {
	queue: BuildQueue.BuildQueue;
	hand: Hand;
}
/**
 * Recursively keep building the same thing until the hand is empty.
 */
export function buildMax(
  buildOpt: BuildOption,
  buildResult: BuildResult
): BuildResult {
  return buildResult.hand
    .payFor(buildOpt)
    .show()
    .caseOf({
      Err: (err) => {
        console.log("buildMax tapping out with", err);
        return buildResult;
      },
      Ok: (h) =>
        buildMax(buildOpt, {
          hand: new Hand(h),
          queue: BuildQueue.add(buildOpt, buildResult.queue),
        }),
    });
}
