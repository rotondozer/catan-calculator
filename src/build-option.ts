import SumType from "sums-up";

export class BuildOption extends SumType<{
  Settlement: [number];
  City: [number];
  DevCard: [number];
  Road: [number];
  None: [];
}> {
  public isSameOption(opt: BuildOption): boolean {
    return opt.type === this.type;
  }

  public merge(opt: BuildOption): BuildOption {
    if (this.isSameOption(opt)) {
      return this.incBy(opt.getNum());
    } else {
      console.warn("trying to merge incompatible types, this is a noOp!");
      return None();
    }
  }

  public incBy(n = 1): BuildOption {
    return this.kind === "None" ? this : new BuildOption(this.kind, this.getNum() + n);
  }

  public toString(): string {
    return this.caseOf({
      Road: () => "road",
      Settlement: () => "settlement",
      City: () => "city",
      DevCard: () => "devCard",
      None: () => "none",
    });
  }

  public getNum(): number {
    const getNum_ = (n: number) => n;
    return this.caseOf({
      Road: getNum_,
      Settlement: getNum_,
      City: getNum_,
      DevCard: getNum_,
      None: () => 0,
    });
  }
}

export function Road(n = 0): BuildOption {
  return new BuildOption("Road", n);
}
export function Settlement(n = 0): BuildOption {
  return new BuildOption("Settlement", n);
}
export function City(n = 0): BuildOption {
  return new BuildOption("City", n);
}
export function DevCard(n = 0): BuildOption {
  return new BuildOption("DevCard", n);
}
export function None(): BuildOption {
  return new BuildOption("None");
}
