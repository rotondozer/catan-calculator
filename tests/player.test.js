const { init, buyDevCard } = require("../build/player");
const { Hand } = require("../build/hand");

describe("player", () => {
  const FRESH_PLAYER = { 
    hand: new Hand(),
    devCards: [],
    victoryPoints: 0,
    roads: 15,
    settlements: 5,
    cities: 4
  };
  test("init", () => {
    const overwrites = { hand: new Hand({ wood: 2 }), victoryPoints: 1 };
    expect(init()).toEqual(FRESH_PLAYER);
    expect(init(overwrites)).toEqual({ ...FRESH_PLAYER, ...overwrites });
  });
})