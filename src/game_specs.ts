const Cards = {
  developmentCards: {
    total: 25,
    knights: 14,
    victoryPoints: 5,
    progressCards: {
      yearOfPlenty: 2,
      monopoly: 2,
      roadBuilding: 2
    }
  },
  resources: {
    total: 95,
    brick: 19,
    ore: 19,
    sheep: 19,
    wheat: 19,
    wood: 19
  }
};

const PlayerPieces = {
  roads: 15,
  cities: 4,
  settlements: 5
};

const BoardPieces = {
  harbor: 9,
  seaFrame: 6, // not sure if i need this
  robber: 1,
  longestRoad: 1,
  largestArmy: 1,
  numberTokens: {
    total: 18,
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 2, 
    12: 1
  },
  terrainHexes: {
    total: 19,
    wood: 4,
    wheat: 4,
    sheep: 4,
    ore: 3,
    brick: 3,
    dessert: 1
  }
};

export { BoardPieces, PlayerPieces, Cards };

