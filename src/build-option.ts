import SumType from "sums-up";

export class BuildOption extends SumType<{
  Settlement: [];
  City: [];
  DevCard: [];
  Road: [];
  None: [];
}> {}

export function Road(): BuildOption {
  return new BuildOption("Road");
}
export function Settlement(): BuildOption {
  return new BuildOption("Settlement");
}
export function City(): BuildOption {
  return new BuildOption("City");
}
export function DevCard(): BuildOption {
  return new BuildOption("DevCard");
}
export function None(): BuildOption {
  return new BuildOption("None");
}
