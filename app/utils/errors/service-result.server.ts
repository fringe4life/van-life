import type { Prettify } from "~/types";
import type { Result, ResultFailure } from "~/utils/result";

type ServiceErrorKind =
  | "not_found"
  | "forbidden"
  | "unavailable"
  | "conflict"
  | "insufficient_funds"
  | "invalid_input"
  | "internal";

interface ServiceError {
  kind: ServiceErrorKind;
  message: string;
}

// type ServiceSuccess<T> = Prettify<ResultSuccess<T>>;

type ServiceFailure = Prettify<ResultFailure<ServiceError>>;

export type ServiceResult<T> = Result<T, ServiceError>;

export type { ServiceFailure };
