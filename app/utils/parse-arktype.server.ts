import "~/lib/arktype.config";
import { ArkErrors, type Type } from "arktype";

interface ValidationFailure {
  errors: ArkErrors;
  success: false;
}
interface ValidationSuccess<T extends Type> {
  data: T["infer"];
  success: true;
}

type ValidationResult<T extends Type> =
  | ValidationSuccess<T>
  | ValidationFailure;

/**
 * Validates data against an ArkType schema.
 */
export function validateArkType<T extends Type>(
  schema: T,
  data: unknown
): ValidationResult<T> {
  const result = schema(data);

  if (result instanceof ArkErrors) {
    return {
      errors: result,
      success: false as const,
    } satisfies ValidationFailure;
  }

  return {
    data: result as T["infer"],
    success: true as const,
  } satisfies ValidationSuccess<T>;
}

/**
 * Maps ArkType path errors onto a known field key set for form UIs.
 * Uses problem text (no path prefix) so messages sit cleanly under inputs.
 */
export function arkErrorsToFieldErrors<K extends string>(
  errors: ArkErrors,
  fields: readonly K[]
): Partial<Record<K, string>> {
  const fieldErrors: Partial<Record<K, string>> = {};

  for (const field of fields) {
    const problems = errors.flatProblemsByPath[field];
    if (problems?.length) {
      fieldErrors[field] = problems.join("; ");
    }
  }

  return fieldErrors;
}
