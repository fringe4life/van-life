interface ResultSuccess<T> {
  data: T;
  ok: true;
}

interface ResultError {
  kind: string;
}

export type ResultFailure<E extends ResultError> = E & {
  ok: false;
};

export type Result<T, E extends ResultError> =
  | ResultSuccess<T>
  | ResultFailure<E>;

export function ok<T>(data: T): ResultSuccess<T> {
  return { data, ok: true };
}

export function err<const E extends ResultError>(error: E): ResultFailure<E> {
  return { ...error, ok: false };
}
