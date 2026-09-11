import type { VanModel } from "~/db/client.server";
import { VanState } from "~/db/enums";

/**
 * A van is rentable when it's not occupied and not in repair.
 */
export function isVanRentable(
  van: Pick<VanModel, "isRented" | "state">
): boolean {
  return !van.isRented && van.state !== VanState.IN_REPAIR;
}
