import { pickFormValues } from "~/components/form/pick-form-values";
import { VAN_ECHO_FIELDS, type VanFormValues } from "~/features/vans/types";

/**
 * Picks known van-form string fields from a FormData / Object.fromEntries bag.
 */
export function toVanFormValues(
  data: Record<string, FormDataEntryValue>
): VanFormValues {
  return pickFormValues(data, VAN_ECHO_FIELDS);
}
