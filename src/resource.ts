import SumType from "sums-up";

class Resource<T = never> extends SumType<{
  Wheat: [];
  Brick: [];
  Ore: [number];
  Sheep: [T];
  Wood: [string];
}> {}

function sum(a: number, b: number): number {
  return a + b;
}
export { sum };
