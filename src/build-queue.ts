import { Maybe } from "seidr";
import * as BuildOption from "./build-option";

const maybe = Maybe.fromNullable;

type Queue = Array<BuildOption.BuildOption>;

export class BuildQueue {
  queue: Queue;

  constructor(fromQ?: Queue) {
    this.queue = this.combineAdjacents(fromQ || []);
  }

  private combineAdjacents(queue_: Queue): Queue {
    console.log("~~~~~ queue_ ===", queue_);

    if (queue_.length === 0) {
      return queue_; // this is how the loop ends: when there aren't any elements ahead
    }

    const currentOpt = queue_[0];

    return maybe(queue_[1]).caseOf({
      Just: nextOpt => {
        if (nextOpt.isSameOption(currentOpt)) {
          return [currentOpt.merge(nextOpt), ...this.combineAdjacents(queue_.slice(2))];
        } else {
          return [currentOpt, ...this.combineAdjacents(queue_.slice(1))];
        }
      },
      Nothing: () => [currentOpt],
    });
  }

  public add(buildOpt: BuildOption.BuildOption): BuildQueue {
    const updatedQueue = maybe(this.queue.pop()).caseOf({
      Nothing: () => [buildOpt], // queue is empty
      Just: lastOpt =>
        this.queue.concat(lastOpt.isSameOption(buildOpt) ? lastOpt.merge(buildOpt) : [lastOpt, buildOpt]), // make sure that last opt gets back in there
    });

    return new BuildQueue(updatedQueue);
  }
}
