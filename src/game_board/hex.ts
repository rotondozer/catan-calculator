import { Just, Maybe, Nothing } from "seidr";
import { v4 as uuidv4 } from "uuid";
import * as Resource from "../resource";
import { flatten, interpose, insertRandomly } from "../util/array";
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
  id: string;
  isAvailable: boolean;
  hexes: Array<Hex>;
  harbor: Maybe<Harbor.Harbor>;
}

export function buildNode(overwrites: Partial<Node> = {}): Node {
  return { 
    id: uuidv4(), 
    isAvailable: true, 
    hexes: [], 
    harbor: Nothing(),
    ...overwrites
  };
}

export function hasHarbor(node: Node): boolean {
  return node.harbor.type === "Just";
}

const RESOURCES: Array<Resource.Resource> = [Resource.Brick(0), Resource.Ore(0), Resource.Sheep(0), Resource.Wheat(0), Resource.Wood(0)];
/**
 * 5 nodes on each of the 6 sides of the game board.
 * 30 coastal nodes
 * n y y n y y n n y y n y y n y y n n y y n y y n y y n n y y
 */
export function buildCoastNodes(): Array<Node> {
  const specials = RESOURCES.map(Harbor.Special).map(buildHarborNodesWithBuffer);
  specials.push([buildNode()]); // concat strips Array, assuming we want it flat
  const generics = Array(4).fill(Harbor.Generic()).map(buildHarborNodesWithBuffer);
  generics.push([buildNode()]);

  const res = insertRandomly([buildNode()], interpose(specials, generics));
  return flatten(res);
}

/**
 * A "Harbor" represents a pair of Nodes, joined by:
 *  1. trade value (generic@3 or type of resource@2)
 *  2. their Nodes are located *adjacent* to one another on a coast  
 * 
 * @returns 3 nodes - a buffer empty node followed by the pair of ports
 */
function buildHarborNodesWithBuffer(h: Harbor.Harbor): Array<Node> {
  return [buildNode(), buildNode({ harbor: Just(h) }), buildNode({ harbor: Just(h) })];
}
