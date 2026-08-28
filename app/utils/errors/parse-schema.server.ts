import {
  type BaseIssue,
  type GenericSchema,
  getDotPath,
  type InferOutput,
  safeParse,
} from "valibot";

interface ValidationFailure {
  errors: [BaseIssue<unknown>, ...BaseIssue<unknown>[]];
  success: false;
}
interface ValidationSuccess<TSchema extends GenericSchema> {
  data: InferOutput<TSchema>;
  success: true;
}

type ValidationResult<TSchema extends GenericSchema> =
  | ValidationSuccess<TSchema>
  | ValidationFailure;

/**
 * Validates data against a Valibot schema.
 */
export function validateSchema<TSchema extends GenericSchema>(
  schema: TSchema,
  data: unknown
): ValidationResult<TSchema> {
  const result = safeParse(schema, data);

  if (result.success) {
    return {
      data: result.output,
      success: true as const,
    } satisfies ValidationSuccess<TSchema>;
  }

  return {
    errors: result.issues,
    success: false as const,
  } satisfies ValidationFailure;
}

const ARRAY_INDEX_SEGMENT = /^\d+$/;

/**
 * Longest allowlisted prefix of a Valibot dot path.
 * `address.city` → `address.city` if listed, else `address`.
 * Array indexes may be stripped (`items.0.name` → `items.name`).
 */
function matchAllowedField<K extends string>(
  path: string,
  allowed: Set<K>
): K | undefined {
  let remaining = path.split(".");

  while (remaining.length > 0) {
    const dotted = remaining.join(".");

    if (allowed.has(dotted as K)) {
      return dotted as K;
    }

    const withoutIndexes = remaining
      .filter((segment) => !ARRAY_INDEX_SEGMENT.test(segment))
      .join(".");

    if (withoutIndexes !== dotted && allowed.has(withoutIndexes as K)) {
      return withoutIndexes as K;
    }

    remaining = remaining.slice(0, -1);
  }

  return undefined;
}

/**
 * Maps schema path issues onto a known field key set for form UIs.
 */
export function schemaErrorsToFieldErrors<K extends string>(
  errors: readonly BaseIssue<unknown>[],
  fields: readonly K[]
): Partial<Record<K, string>> {
  const allowed = new Set(fields);
  const fieldErrors: Partial<Record<K, string>> = {};

  for (const issue of errors) {
    const path = getDotPath(issue);

    if (!path) {
      continue;
    }

    const key = matchAllowedField(path, allowed);

    if (!key) {
      continue;
    }

    const existing = fieldErrors[key];
    fieldErrors[key] = existing
      ? `${existing}; ${issue.message}`
      : issue.message;
  }

  return fieldErrors;
}
