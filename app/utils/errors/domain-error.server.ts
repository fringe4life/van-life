/** biome-ignore-all lint/suspicious/noUnnecessaryConditions: DomainErrorCode cases reachable; biome mis-narrows after isDomainError */
import { data } from "react-router";
import { notFound } from "~/utils/errors/not-found";
import { err, type ServiceFailure } from "~/utils/errors/service-result.server";

type DomainErrorCode = "NOT_FOUND" | "CONFLICT" | "INVALID_ID";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly entity?: string;

  constructor(code: DomainErrorCode, message: string, entity?: string) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.entity = entity;
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

/**
 * Map a {@link DomainError} into a service-layer failure for actions/forms.
 */
export function domainErrorToServiceResult(error: DomainError): ServiceFailure {
  switch (error.code) {
    case "NOT_FOUND":
      return err({ kind: "not_found", message: error.message });
    case "CONFLICT":
      return err({ kind: "conflict", message: error.message });
    case "INVALID_ID":
      return err({ kind: "invalid_input", message: error.message });
    default:
      throw new Error(`Unknown domain error code: ${error.code}` as never);
  }
}

/**
 * Map any caught value: domain → typed failure; else → internal.
 */
export function caughtErrorToServiceResult(
  error: unknown,
  fallbackMessage: string
): ServiceFailure {
  if (isDomainError(error)) {
    return domainErrorToServiceResult(error);
  }

  return err({ kind: "internal", message: fallbackMessage });
}

/**
 * Loader/middleware path: turn DomainError into a thrown HTTP response.
 * Re-throws non-domain errors unchanged.
 */
export function throwDomainHttp(error: unknown): never {
  if (!isDomainError(error)) {
    throw error;
  }

  switch (error.code) {
    case "NOT_FOUND":
      return notFound(error.message);
    case "INVALID_ID":
      throw data(error.message, { status: 400 });
    case "CONFLICT":
      throw data(error.message, { status: 409 });
    default:
      throw new Error(`Unknown domain error code: ${error.code}` as never);
  }
}
