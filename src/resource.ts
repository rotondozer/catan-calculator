import SumType from "sums-up";

class Resource<T = never> extends SumType<{
  Wheat: [];
  Brick: [];
  Ore: [number];
  Sheep: [T];
  Wood: [string];
}> {}

const card = new Resource("Wheat");
const progressPercentage = card.caseOf({
  Wheat: () => "I'm a what",
  _: () => "",
});
