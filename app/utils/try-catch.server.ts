import type { Result } from '~/types/types';

export const tryCatch = async <T, E>(
	operation: () => Promise<T>
): Promise<Result<T, E>> => {
	try {
		const data = await operation();
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
};
