import { SIX_MONTHS } from "~/constants/time-constants";
import type { VanModel } from "~/db/client.server";
import { VanState } from "~/db/enums";
import type { LowercaseVanState } from "../types";

/**
 * Determines if a van is considered "new" based on its creation date
 * @param createdAt - The van's creation date
 * @returns True if the van was created within the last 6 months
 */
function isVanNew(createdAt: VanModel["createdAt"]): boolean {
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - SIX_MONTHS,
    now.getDate()
  );
  const isNew = new Date(createdAt) > sixMonthsAgo;

  return isNew;
}

/**
 * Gets the lowercase van state
 * @param van - The van model
 * @returns The lowercase state string
 */
export function lowercaseVanState(van: VanModel): LowercaseVanState {
  const isNew = isVanNew(van.createdAt);

  // Determine the state
  if (isNew) {
    return "new";
  }
  if (van.state === VanState.IN_REPAIR) {
    return "repair";
  }
  if (van.state === VanState.ON_SALE) {
    return "sale";
  }
  return "available";
}

/**
 * Determines whether a van is currently available for rent.
 * A van is available when it's not rented and not in repair.
 */
export function isVanAvailable(
  van: Pick<VanModel, "isRented" | "state">
): boolean {
  return !van.isRented && van.state !== VanState.IN_REPAIR;
}
