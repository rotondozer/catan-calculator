import * as DevCard from "./dev_card";
import * as ProgressCard from "./progress_card";
import { Maybe } from "seidr";

/**
 * 25 Development Cards:
 *   - 14 Knights
 *   - 5 Victory Points
 *   - 6 Progress Cards (2 of each) 
 */
export default class Deck {
  private _deck: Array<DevCard.DevCard>;
  constructor() {
    this._deck = shuffle([
      ...this.unwrapKnights(),
      ...this.unwrapVictoryPoints(), 
      ...this.unwrapProgressCards()
    ]);
  }

  private unwrapKnights(): Array<DevCard.DevCard> {
    return new Array(14).fill(DevCard.Knight());
  }

  private unwrapVictoryPoints(): Array<DevCard.DevCard> {
    return new Array(5).fill(DevCard.VictoryPoint());
  }

  private unwrapProgressCards(): Array<DevCard.DevCard> {
    return [
      DevCard.Progress(ProgressCard.Monopoly()),
      DevCard.Progress(ProgressCard.Monopoly()),
      DevCard.Progress(ProgressCard.RoadBuilding()),
      DevCard.Progress(ProgressCard.RoadBuilding()),
      DevCard.Progress(ProgressCard.YearOfPlenty()),
      DevCard.Progress(ProgressCard.YearOfPlenty())
    ];
  }

  public draw(): Maybe<DevCard.DevCard> {
    return Maybe.fromNullable(this._deck.pop());
  }
}

function shuffle<T>(array: Array<T>): Array<T> {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}