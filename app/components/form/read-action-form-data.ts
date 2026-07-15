import type {
  FormActionFailure,
  FormActionResult,
} from "~/components/form/form-action-result";

interface ReadActionFormDataOptions<
  TValueFields extends string,
  TDefaults extends Partial<Record<TValueFields, string>>,
> {
  /**
   * Applied under echoed failure values.
   * Keys listed here are always present as strings on the returned `formData`
   * (echo overrides default; idle/success → default only).
   */
  defaults?: TDefaults;
}

type ActionDataLike<TFields extends string, TValueFields extends string> =
  | FormActionResult<object, TFields, TValueFields>
  | FormActionFailure<TFields, TValueFields>
  | null
  | undefined;

type MergedFormData<
  TValueFields extends string,
  TDefaults extends Partial<Record<TValueFields, string>>,
> = Partial<Record<TValueFields, string>> & {
  [K in keyof TDefaults]-?: string;
};

/**
 * Unpack FormActionResult / FormActionFailure for form UI.
 * Merges echo `formData` over `defaults` so callers avoid `ok === false` ternaries.
 */
const readActionFormData = <
  TFields extends string,
  TValueFields extends string,
  TDefaults extends Partial<Record<TValueFields, string>> = Partial<
    Record<TValueFields, string>
  >,
>(
  data: ActionDataLike<TFields, TValueFields>,
  options: ReadActionFormDataOptions<TValueFields, TDefaults> = {}
) => {
  const defaults = options.defaults ?? ({} as TDefaults);
  const failure = data?.ok === false ? data : undefined;

  const formData = {
    ...defaults,
  } as unknown as MergedFormData<TValueFields, TDefaults>;

  if (failure?.formData) {
    for (const key of Object.keys(failure.formData) as TValueFields[]) {
      const value = failure.formData[key];
      if (value !== undefined) {
        (formData as Partial<Record<TValueFields, string>>)[key] = value;
      }
    }
  }

  return {
    fieldErrors: failure?.fieldErrors,
    formData,
    formError: failure?.formError,
    ok: data?.ok,
  };
};

export type { ReadActionFormDataOptions };
export { readActionFormData };
