import SumType from "sums-up";
import * as Resource from "../resource";

/**
 * - 9 Harbors in total:
 *   - 1 for each Resource type
 *   - 4 Generics
 * - Each Harbor has a pair of adjacent coastal nodes
 */
export class Harbor extends SumType<{ 
  Generic: [], 
  Special: [Resource.Resource]
 }> {}
export function Generic(): Harbor {
  return new Harbor("Generic");
}
export function Special(resource: Resource.Resource): Harbor {
  return new Harbor("Special", resource);
}