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
      DevCard: () => "development card",
      None: () => "none",
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
