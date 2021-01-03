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

	public bankTrade(resourceOut: keyof IHand, resourceIn: keyof IHand): Hand {
		// get trade rate (adjust for ports)
		return this.remove(4, resourceOut).add(1, resourceIn);
	}

	public payFor(buildOption: BuildOption): Hand {
		return buildOption.caseOf({
			None: () => this,
			Road: () => this.remove(1, "brick").remove(1, "wood"),
			Settlement: () =>
				this.remove(1, "sheep")
					.remove(1, "wheat")
					.remove(1, "brick")
					.remove(1, "wood"),
			City: () => this.remove(3, "ore").remove(2, "wheat"),
			DevCard: () =>
				this.remove(1, "wheat").remove(1, "sheep").remove(1, "ore"),
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
			Ok: (h) => {
				const result = h[resource] - n;
				return result < 0
					? new Hand(`insufficient ${resource}`)
					: new Hand({ ...h, [resource]: result });
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
	return Object.values(hand).some((v) => v && v < 0)
}

interface BuildResult {
	count: BuildQueue;
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
					count: buildResult.count.add(buildOpt),
				}),
		});
}
