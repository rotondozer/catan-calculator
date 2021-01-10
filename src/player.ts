import * as DevCard from "./development_cards/dev_card";
import { Hand } from "./hand";
import { PlayerPieces } from "./game_specs";
import * as BuildOption from "./build_option";
import Deck from "./development_cards/deck";

interface IPlayer {
  hand: Hand;
  devCards: Array<DevCard.DevCard>;
  victoryPoints: number;
  roads: number;
  settlements: number;
  cities: number;
}

function init(overwrites: Partial<IPlayer> = {}): IPlayer {
  return {
    hand: new Hand(),
    devCards: [],
    victoryPoints: 0,
    roads: PlayerPieces.roads,
    settlements: PlayerPieces.settlements,
    cities: PlayerPieces.cities,
    ...overwrites
  };
}

function buyDevCard(deck: Deck, player: IPlayer): IPlayer {
  return player.hand.payFor(BuildOption.DevCard()).show().caseOf({
    Err: _ => player,
    Ok: hand => {
      return {
        ...player,
        devCards: deck.draw().map(player.devCards.concat).getOrElse(player.devCards),
        hand: new Hand(hand)
      };
    }
  });
}

export { init, buyDevCard };