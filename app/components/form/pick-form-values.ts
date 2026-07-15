/**
 * Picks an allowlisted set of string fields from a FormData / Object.fromEntries bag.
 * Use with `*_ECHO_FIELDS` so secrets (e.g. passwords) are never replayed to the client.
 */
const pickFormValues = <K extends string>(
  data: Record<string, FormDataEntryValue>,
  fields: readonly K[]
): Partial<Record<K, string>> => {
  const values: Partial<Record<K, string>> = {};

  for (const field of fields) {
    const value = data[field];
    if (typeof value === "string") {
      values[field] = value;
    }
  }

  return values;
};

export { pickFormValues };
