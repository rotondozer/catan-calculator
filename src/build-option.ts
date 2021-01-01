import { Maybe } from "seidr";
import SumType from "sums-up";

export class BuildOption extends SumType<{
  Settlement: [number?];
  City: [number?];
  DevCard: [number?];
  Road: [number?];
  None: [];
}> {
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
    const getNum_ = (n?: number) => n || 0;
    return this.caseOf({
      Road: getNum_,
      Settlement: getNum_,
      City: getNum_,
      DevCard: getNum_,
      None: () => 0,
    });
  }
}

export function Road(n?: number): BuildOption {
  return new BuildOption("Road", n);
}
export function Settlement(n?: number): BuildOption {
  return new BuildOption("Settlement", n);
}
export function City(n?: number): BuildOption {
  return new BuildOption("City", n);
}
export function DevCard(n?: number): BuildOption {
  return new BuildOption("DevCard", n);
}
export function None(): BuildOption {
  return new BuildOption("None");
}
