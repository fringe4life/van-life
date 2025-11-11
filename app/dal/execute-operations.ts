import { tryCatch } from '~/utils/try-catch.server';
import type { DalError, DalReturn } from './types';

/**
 * DAL function that executes multiple database operations with optional fallback values
 * @param operations - Object containing database operations (functions that return promises)
 * @param defaults - Optional object containing default values for each operation
 * @returns DalReturn with results or error
 */
export async function executeOperations<
	T extends Record<string, () => Promise<unknown>>,
	D extends Partial<Record<keyof T, unknown>> = Partial<
		Record<keyof T, unknown>
	>,
>(
	operations: T,
	defaults?: D
): Promise<DalReturn<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }, DalError>> {
	// Execute all operations with tryCatch and Promise.all
	const operationEntries = Object.entries(operations);
	const wrappedOperations = operationEntries.map(([, operation]) =>
		tryCatch(async () => operation())
	);

	const results = await Promise.all(wrappedOperations);

	// Create result object with fallback values
	const result = {} as Record<string, unknown>;

	for (let i = 0; i < operationEntries.length; i += 1) {
		const [key] = operationEntries[i];
		const resultData = results[i];

		if (resultData.error || !resultData.data) {
			// Use fallback value if operation failed, or null if no defaults provided
			result[key] = defaults?.[key] ?? null;
		} else {
			result[key] = resultData.data;
		}
	}

	return {
		success: true,
		data: result as { [K in keyof T]: Awaited<ReturnType<T[K]>> },
		error: null,
	};
}
