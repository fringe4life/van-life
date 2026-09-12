export interface LiteralCatalog<T extends string | number> {
  excluding: <E extends T>(...drop: E[]) => LiteralCatalog<Exclude<T, E>>;
  includes: (raw: unknown) => raw is T;
  parse: (raw: unknown) => T | null;
  parseMany: (raws: readonly unknown[]) => T[];
  readonly values: readonly [T, ...T[]];
}

const EMPTY_CATALOG_ERROR = "Literal catalog requires at least one value";

function requireNonEmptyValues<T extends string | number>(
  values: readonly T[]
): [T, ...T[]] {
  if (values.length === 0) {
    throw new Error(EMPTY_CATALOG_ERROR);
  }

  return values as [T, ...T[]];
}

/**
 * Closed picklists a handful of members long (theme, VanType, VanState, page
 * limits). Membership scans `values` so that array stays the source of order
 * and identity. If `parseMany` becomes a hot path on a large catalog, keep
 * `values` for order and test membership with a Set built once here.
 */
export const defineCatalog = <const T extends string | number>(
  values: readonly [T, ...T[]]
): LiteralCatalog<T> => {
  const catalogValues = requireNonEmptyValues(values);

  const includes = (raw: unknown): raw is T =>
    catalogValues.some((value) => value === raw);

  const catalog: LiteralCatalog<T> = {
    excluding: <E extends T>(...drop: E[]) =>
      defineCatalog(
        requireNonEmptyValues(
          catalogValues.filter((value): value is Exclude<T, E> =>
            drop.every((excluded) => excluded !== value)
          )
        )
      ),
    includes,
    parse: (raw) => (includes(raw) ? raw : null),
    parseMany: (raws) => {
      const parsed: T[] = [];
      for (const raw of raws) {
        if (includes(raw)) {
          parsed.push(raw);
        }
      }
      return parsed;
    },
    values: catalogValues,
  };

  return catalog;
};
