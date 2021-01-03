import SumType from "sums-up";

export class ProgressCard extends SumType<{
  Monopoly: [];
  RoadBuilding: [];
  YearOfPlenty: [];
}> {}
export function Monopoly(): ProgressCard {
  return new ProgressCard("Monopoly");
}
export function RoadBuilding(): ProgressCard {
  return new ProgressCard("RoadBuilding");
}
export function YearOfPlenty(): ProgressCard {
  return new ProgressCard("YearOfPlenty");
}