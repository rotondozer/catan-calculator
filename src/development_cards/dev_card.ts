import SumType from "sums-up";
import { ProgressCard } from "./progress_card";

export class DevCard extends SumType<{
  Knight: [];
  VictoryPoint: [];
  Progress: [ProgressCard]
}> {}
export function Knight(): DevCard {
  return new DevCard("Knight");
}
export function VictoryPoint(): DevCard {
  return new DevCard("VictoryPoint");
}
export function Progress(card: ProgressCard): DevCard{
  return new DevCard("Progress", card);
}