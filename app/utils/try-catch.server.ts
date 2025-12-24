interface Success<T> {
	data: T;
	error: null;
}
interface Failure<E> {
	data: null;
	error: E;
}

type Result<T, E> = Success<T> | Failure<E>;

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
