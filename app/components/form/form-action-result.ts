import type { Failure, Prettify, Success } from "~/types";

type FormActionSuccess<TSuccess extends object = object> = Prettify<
  TSuccess & Success
>;

type FormActionFailure<
  TFields extends string,
  TValueFields extends string = TFields,
> = Prettify<
  Failure & {
    fieldErrors?: Partial<Record<TFields, string>>;
    formData?: Partial<Record<TValueFields, string>>;
    formError?: string;
  }
>;

type FormActionResult<
  TSuccess extends object = object,
  TFields extends string = string,
  TValueFields extends string = TFields,
> = FormActionSuccess<TSuccess> | FormActionFailure<TFields, TValueFields>;

/** Unwrap `as const` field arrays into {@link FormActionFailure} generics. */
type FormActionFailureFrom<
  TFields extends readonly string[],
  TEcho extends readonly string[] = TFields,
> = FormActionFailure<TFields[number], TEcho[number]>;

/** Unwrap `as const` field arrays into {@link FormActionResult} generics. */
type FormActionResultFrom<
  TSuccess extends object,
  TFields extends readonly string[],
  TEcho extends readonly string[] = TFields,
> = FormActionResult<TSuccess, TFields[number], TEcho[number]>;

export type {
  FormActionFailure,
  FormActionFailureFrom,
  FormActionResult,
  FormActionResultFrom,
  FormActionSuccess,
};
