import SumType from "sums-up";

export class Resource extends SumType<{
  Brick: [number];
  Ore: [number];
  Sheep: [number];
  Wheat: [number];
  Wood: [number];
}> {}

export function Brick(n: number): Resource {
  return new Resource("Brick", n);
}
export function Ore(n: number): Resource {
  return new Resource("Ore", n);
}
export function Sheep(n: number): Resource {
  return new Resource("Sheep", n);
}
export function Wheat(n: number): Resource {
  return new Resource("Wheat", n);
}
export function Wood(n: number): Resource {
  return new Resource("Wood", n);
}

// temporary for jest
export function sum(a: number, b: number): number {
  return a + b;
}
