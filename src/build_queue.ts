import { Maybe } from "seidr";
import * as BuildOption from "./build_option";

const maybe = Maybe.fromNullable;

export type BuildQueue = Array<BuildOption.BuildOption>;

export function add(buildOpt: BuildOption.BuildOption, queue: BuildQueue): BuildQueue {
  const queue2 = queue.length ? [ ...queue ] : [];
  return maybe(queue2.pop()).caseOf({
    Nothing: () => [buildOpt], // queue is empty
    Just: lastOpt =>
      queue2.concat(lastOpt.isSameOption(buildOpt) 
        ? lastOpt.merge(buildOpt) 
        : [lastOpt, buildOpt]) // make sure that last opt gets back in there
  });
}

export function combineAdjacents(queue: BuildQueue): BuildQueue {
  if (queue.length === 0) {
    return queue; // this is how the loop ends: when there aren't any elements ahead
  }

  const currentOpt = queue[0];

  return maybe(queue[1]).caseOf({
    Just: nextOpt => {
      if (nextOpt.isSameOption(currentOpt)) {
        return [currentOpt.merge(nextOpt), ...combineAdjacents(queue.slice(2))];
      } else {
        return [currentOpt, ...combineAdjacents(queue.slice(1))];
      }
    },
    Nothing: () => [currentOpt]
  });
}
