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
