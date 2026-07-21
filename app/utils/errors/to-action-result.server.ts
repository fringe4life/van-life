/** biome-ignore-all lint/suspicious/noUnnecessaryConditions: ServiceErrorKind cases reachable; biome mis-narrows after ok discriminant */
import type { FormActionFailure } from "~/components/form/form-action-result";
import { badRequest } from "~/utils/errors/bad-request";
import { conflict } from "~/utils/errors/conflict";
import { internalError } from "~/utils/errors/internal-error";
import { notFound } from "~/utils/errors/not-found";
import type { ServiceResult } from "~/utils/errors/service-result.server";

type ActionFailureExtras<
  TFields extends string,
  TValueFields extends string = TFields,
> = Pick<FormActionFailure<TFields, TValueFields>, "fieldErrors" | "formData">;

/**
 * Map a service failure to form action data with the correct HTTP status.
 *
 * - `not_found` → throws {@link notFound} (ErrorBoundary)
 * - client kinds → {@link badRequest} / {@link conflict}
 * - `invalid_input` → {@link badRequest} (malformed params / ids)
 * - `internal` → {@link internalError} (inline formError, status 500)
 *
 * Returns `null` when `result.ok` so the caller can handle success.
 */
export function toActionResultOrThrow<
  TFields extends string = string,
  TValueFields extends string = TFields,
>(
  result: ServiceResult<unknown>,
  extras?: ActionFailureExtras<TFields, TValueFields>
) {
  if (result.ok) {
    return null;
  }

  const payload = {
    formError: result.message,
    ok: false as const,
    ...extras,
  } satisfies FormActionFailure<TFields, TValueFields>;

  switch (result.kind) {
    case "not_found":
      return notFound(result.message);
    case "forbidden":
    case "unavailable":
    case "insufficient_funds":
    case "invalid_input":
      return badRequest(payload);
    case "conflict":
      return conflict(payload);
    case "internal":
      return internalError(payload);
    default:
      throw new Error(`Unknown service result kind: ${result.kind}` as never);
  }
}
