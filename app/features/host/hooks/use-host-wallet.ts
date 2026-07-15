import {
  type ChangeEventHandler,
  type SubmitEventHandler,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useFetcher } from "react-router";
import type { FormActionResultFrom } from "~/components/form/form-action-result";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { balanceReducer } from "~/features/host/hooks/balance-reducer";
import {
  MONEY_ECHO_FIELDS,
  MONEY_FORM_FIELDS,
} from "~/features/host/types";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

type HostWalletActionData = FormActionResultFrom<
  object,
  typeof MONEY_FORM_FIELDS,
  typeof MONEY_ECHO_FIELDS
>;

/**
 * Host dashboard wallet deposit/withdraw UI state.
 *
 * `isPending` is fed into {@link getFetcherStatus}'s `isTransitionPending` (via
 * the wallet form + {@link useAutoIdleStatus}). Keep `startTransition` for
 * **submit only** (optimistic balance + `fetcher.submit`).
 *
 * Do **not** wrap radio/type toggles (or other chrome) in that same transition:
 * after a successful submit, `fetcher.data.ok === true` stays until the next
 * submit. A non-submit `isPending` blip becomes `pending` → `success` again,
 * and `useAutoIdleStatus` treats that as a fresh success flash even though the
 * user did not submit.
 *
 * @see getFetcherStatus — `isTransitionPending` must mean "this form is submitting"
 */
const useHostWallet = (transactionSummary: number) => {
  const fetcher = useFetcher<HostWalletActionData>();
  const [isPending, startTransition] = useTransition();
  const [typeOverride, setTypeOverride] = useState<string | null>(null);

  const { formData } = readActionFormData(fetcher.data);
  const activeType = typeOverride ?? formData.type ?? DEPOSIT;
  const isDepositing = activeType !== WITHDRAW;

  const [optimisticBalance, addOptimisticBalance] = useOptimistic(
    transactionSummary,
    balanceReducer
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const submitted = new FormData(event.currentTarget);
    const amount = Number(submitted.get("amount"));
    const transactionType = String(submitted.get("type") ?? "");
    if (!transactionType) {
      return;
    }

    startTransition(() => {
      addOptimisticBalance({ amount, type: transactionType });
      startTransition(async () => {
        await fetcher.submit(submitted, { method: "POST" });
      });
    });
  };

  // Sync setState — tiny update; must not share submit's `startTransition`/`isPending`
  // (see hook doc above: stale `ok: true` would re-flash StatusButton success).
  const handleChangeType: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTypeOverride(event.currentTarget.value);
  };

  return {
    fetcher,
    handleChangeType,
    handleSubmit,
    isDepositing,
    isPending,
    optimisticBalance,
  };
};

export { useHostWallet };
