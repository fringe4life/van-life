import { VAN_FORM_FIELDS, type VanFormValues } from "~/features/vans/types";

/**
 * Picks known van-form string fields from a FormData / Object.fromEntries bag.
 */
export function toVanFormValues(
  data: Record<string, FormDataEntryValue>
): VanFormValues {
  const values: VanFormValues = {};

  for (const field of VAN_FORM_FIELDS) {
    const value = data[field];
    if (typeof value === "string") {
      values[field] = value;
    }
  }

  return values;
}
