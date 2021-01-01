import { Maybe } from "seidr";
import * as BuildOption from "./build-option";

type BuildCount = Array<BuildOption.BuildOption>;

export class BuildCounter {
  public builds: BuildCount;

  constructor(fromBuild?: BuildCount) {
    this.builds = Maybe.fromNullable(fromBuild).getOrElse([]);
  }

  public add(buildOpt: BuildOption.BuildOption): BuildCounter {
    const numToAdd = buildOpt.getNum();
    const BuildOpt = BuildOption[buildOpt.type];

    const updatedBuildCount = this.findBuildOpt(buildOpt).caseOf({
      Nothing: () => this.builds.concat(BuildOpt(numToAdd)),
      Just: opt => this.builds.filter(bo => bo.type !== opt.type).concat(BuildOpt(opt.getNum() + numToAdd)),
    });

    return new BuildCounter(updatedBuildCount);
  }

  private findBuildOpt(buildOpt: BuildOption.BuildOption): Maybe<BuildOption.BuildOption> {
    const existingBuildOpt = this.builds.find(opt => opt.kind === buildOpt.kind);
    return Maybe.fromNullable(existingBuildOpt);
  }
}
