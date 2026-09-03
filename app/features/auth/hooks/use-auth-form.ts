import { type SubmitEventHandler, useTransition } from "react";
import { useFetcher } from "react-router";
import type { FormActionFailure } from "~/components/form/form-action-result";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";

/**
 * Shared login/signup fetcher + StatusButton pending/error flash.
 *
 * Keep field lists and echo defaults at the route. Do not wrap non-submit
 * chrome in this transition — stale `ok: false` plus a pending blip re-flashes
 * error via {@link useAutoIdleStatus}.
 */
const useAuthForm = <TDefaults extends Record<string, string>>(
  defaults: TDefaults
) => {
  const fetcher = useFetcher<FormActionFailure<string, string>>();
  const [isPending, startTransition] = useTransition();
  const { fieldErrors, formData, formError } = readActionFormData(
    fetcher.data,
    {
      defaults,
    }
  );

  const status = useAutoIdleStatus(
    getFetcherStatus(fetcher.state, fetcher.data, {
      isTransitionPending: isPending,
    })
  );
  const isSubmitting = status === "pending";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const fieldValues = new FormData(event.currentTarget);
    startTransition(async () => {
      await fetcher.submit(fieldValues, { method: "POST" });
    });
  };

  return {
    Form: fetcher.Form,
    fieldErrors,
    formData,
    formError,
    handleSubmit,
    isSubmitting,
    status,
  };
};

export { useAuthForm };
