import SumType from "sums-up";

class DevCard<T> extends SumType<{
  VictoryPoint: [];
  Knight: [];
  RoadBuilding: [];
  Monopoly: [];
}> {}

function VictoryPoint<T>(): DevCard<T> {
  return new DevCard("VictoryPoint");
}

function Knight<T>(): DevCard<T> {
  return new DevCard("Knight");
}

const x = VictoryPoint();

const result = x.caseOf({
  Knight: () => "nope",
  VictoryPoint: () => "bar",
  RoadBuilding: () => "rabbble",
  Monopoly: () => "Moo",
});
