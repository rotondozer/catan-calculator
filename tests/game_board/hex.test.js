const { buildCoastNodes, buildNode } = require("../../build/game_board/hex");
const Harbor = require("../../build/game_board/harbor");
const Resource = require("../../build/resource");
const { Just, Maybe, Nothing } = require("seidr");

describe("Hex", () => {
  describe("buildCoastNodes", () => {
    it("has 30 nodes", () => {
      expect(buildCoastNodes()).toHaveLength(30);
    });
    it("builds 18 nodes associated with harbors (2 for each Harbor)", () => {
      expect(buildCoastNodes().filter(node => !node.harbor.equals(Nothing()))).toHaveLength(18);
    })

    it("builds 2 consecutive nodes for each resource (total 10)", () => {
      const nodes = buildCoastNodes()
        .filter(node => !node.harbor.equals(Nothing()))
        .filter(node => node.harbor.getOrElse().type === "Special");
        
      const specNodes = [
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Brick(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Brick(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Ore(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Ore(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Sheep(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Sheep(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Wheat(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Wheat(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Wood(0))) }),
        expect.objectContaining({ harbor: Just(Harbor.Special(Resource.Wood(0))) })
      ];

      expect(nodes).toHaveLength(10);
      expect(nodes).toEqual(expect.arrayContaining(specNodes))
    })

    it("4 Generic Harbors (total 4)", () => {
      const genNodes = buildCoastNodes()
        .filter(node => !node.harbor.equals(Nothing()))
        .filter(node => node.harbor.getOrElse().type === "Generic");
      

      expect(genNodes).toHaveLength(8);
    })
  })
})