import type { Failure, Prettify, Success } from "~/types";

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

type ServiceSuccess<T> = Prettify<Success & { data: T }>;

type ServiceFailure = Prettify<Failure & ServiceError>;

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

export type { ServiceError, ServiceErrorKind, ServiceFailure, ServiceSuccess };

export function ok<T>(data: T): ServiceSuccess<T> {
  return { data, ok: true };
}

export function err(error: ServiceError): ServiceFailure {
  return { kind: error.kind, message: error.message, ok: false };
}
