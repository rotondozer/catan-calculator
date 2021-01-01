import * as BuildOption from "./build-option";

type BuildCount = Set<BuildOption.BuildOption>;

export class BuildCounter {
  public build: BuildCount;

  constructor(fromBuild?: BuildCount) {
    this.build = new Set(fromBuild);
  }

  public add(buildOpt: BuildOption.BuildOption): BuildCounter {
    const updatedBuildOpt = buildOpt.caseOf({
      _: (n = 0) => BuildOption[buildOpt.type](n + 1),
      None: () => buildOpt,
    });
    const newBuildCount = new Set([...this.build, updatedBuildOpt]);
    return new BuildCounter(newBuildCount);
  }
}
