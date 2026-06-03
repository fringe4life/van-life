import { ArkErrors, type Type } from 'arktype';

export type ValidationResult<T extends Type> =
	| { success: true; data: T['infer'] }
	| { success: false; errors: ArkErrors };

/**
 * Validates data against an ArkType schema.
 */
export function validateArkType<T extends Type>(
	schema: T,
	data: unknown
): ValidationResult<T> {
	const result = schema(data);

	if (result instanceof ArkErrors) {
		return { success: false as const, errors: result };
	}

	return { success: true as const, data: result as T['infer'] };
}
