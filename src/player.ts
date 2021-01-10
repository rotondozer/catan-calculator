import { DevCard } from "./development_cards/dev_card";
import { Hand } from "./hand";

export class Player {
  private _hand: Hand;
  private _devCards: Array<DevCard>;
  private _victoryPoints: number;
  public roads: number;
  
  constructor() {
    this._hand = new Hand();
    this._devCards = [];
    this._victoryPoints = 0;
    this.roads = 15;
  }
}