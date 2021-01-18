import * as Hex from "./hex";
// import * as Resource from "../resource";

/**
   [
        [Hex, Hex, Hex],
      [Hex, Hex, Hex, Hex],
    [Hex, Hex, Hex, Hex, Hex],
      [Hex, Hex, Hex, Hex],
        [Hex, Hex, Hex]
    ]
 */
type Board = Array<Array<Hex.Hex>>;

export function init(): Board {
  return [
    new Array<Hex.Hex>(3).fill(Hex.buildHex()),
    new Array<Hex.Hex>(4).fill(Hex.buildHex()),
    new Array<Hex.Hex>(5).fill(Hex.buildHex()),
    new Array<Hex.Hex>(4).fill(Hex.buildHex()),
    new Array<Hex.Hex>(3).fill(Hex.buildHex())
  ];
}
