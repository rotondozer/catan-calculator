import { Just, Maybe, Nothing } from "seidr";
import * as Resource from "../resource";
import * as Harbor from "./harbor";
/**
 *   H H H  
 *  H H H H
 * H H H H H
 *  H H H H
 *   H H H
 *   
 *  A standard map has 19 hexes.
 */
export interface Hex {
  number: number; // use 0 to represent Desert?
  hasRobber: boolean;
  produces: Resource.Resource | "desert";
  nodes: Array<Node>
}

export function buildHex(overwrites: Partial<Hex> = {}): Hex {
  return {
    number: 0,
    hasRobber: false,
    produces: "desert",
    nodes: [],
    ...overwrites
  }; 
}

/**
 * A Node represents any point on a hex (any place settlement can be built).
 * 
 * A standard map has HOW MANY nodes?
 * 
 * It can be a juncture of hexes (i.e. middle of map) or 
 * a lonely tip on the sea.
 */
export interface Node {
  id: number; //   0..maxNode  (for now)
  isAvailable: boolean;
  hexes: Array<Hex>;
  harbor: Maybe<Harbor.Harbor>;
}

export function buildNode(overwrites: Partial<Node> = {}): Node {
  return { 
    id: 0, 
    isAvailable: true, 
    hexes: [], 
    harbor: Nothing(),
    ...overwrites
  };
}

const RESOURCES: Array<Resource.Resource> = [Resource.Brick(0), Resource.Ore(0), Resource.Sheep(0), Resource.Wheat(0), Resource.Wood(0)];
/**
 * 5 nodes on each of the 6 sides of the game board.
 * 30 coastal nodes
 * n y y n y y n n y y n y y n y y n n y y n y y n y y n n y y
 * ids are 0-indexed 
 */
export function buildCoastNodes(): Array<Node> {
  return [...Array(30).keys()].map((id) => {
    switch (id + 1) {
      case 2:
      case 3:
        return buildNode({ harbor: Just(Harbor.Special(RESOURCES[0])), id });
      case 5:
      case 6:
        return buildNode({ harbor: Just(Harbor.Generic()), id });
      case 9:
      case 10:
        return buildNode({ harbor: Just(Harbor.Special(RESOURCES[1])), id });
      case 12:
      case 13:
        return buildNode({ harbor: Just(Harbor.Special(RESOURCES[2])), id });
      case 15:
      case 16:
        return buildNode({ harbor: Just(Harbor.Generic()), id });   
      case 19:
      case 20:
        return buildNode({ harbor: Just(Harbor.Generic()), id });
      case 22:
      case 23:
        return buildNode({ harbor: Just(Harbor.Special(RESOURCES[3])), id });
      case 26:
      case 27:
        return buildNode({ harbor: Just(Harbor.Generic()), id });
      case 29:
      case 30:
        return buildNode({ harbor: Just(Harbor.Special(RESOURCES[4])), id });
      default:
        return buildNode({ id });
    }
  });
}

/**
 * A "Harbor" represents a pair of Nodes, joined by:
 *  1. trade value (generic@3 or type of resource@2)
 *  2. their Nodes are located *adjacent* to one another on a coast  
 * 
 * Harbors need one Node on either side that is not part of another Harbor.
 * This is the *minimum* buffer. I haven't ever seen it exceed 2 on one side, and 1 on the other...
 */
// function buildHarborNodesWithBuffer(harbor: Harbor.Harbor, coastNodes: Array<Array>): Array<Node> {
//   return [buildNode({ id }), buildNode({ id, harbor: Just(harbor) }), buildNode({ id, harbor: Just(harbor) }), buildNode({ id })]
// }

// function getNextId(nodes: Array<Node>): number {
//   const highestId = nodes.reduce((high, node) => node.id > high ? node.id : high, 0);
//   return highestId + 1;
// }
