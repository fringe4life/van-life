import {
  type ChangeEventHandler,
  type SubmitEventHandler,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useFetcher } from "react-router";
import { balanceReducer } from "~/features/host/hooks/balance-reducer";
import type { MoneyFormFieldErrors } from "~/features/host/types";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

interface HostWalletActionData {
  fieldErrors?: MoneyFormFieldErrors;
  formData?: {
    amount: string;
    type: string;
  };
  formError?: string;
}

const useHostWallet = (transactionSummary: number) => {
  const fetcher = useFetcher<HostWalletActionData>();
  const [isPending, startTransition] = useTransition();
  const [typeOverride, setTypeOverride] = useState<string | null>(null);

  const submittedType = fetcher.data?.formData?.type;
  const activeType = typeOverride ?? submittedType ?? DEPOSIT;
  const isDepositing = activeType !== WITHDRAW;

  const [optimisticBalance, addOptimisticBalance] = useOptimistic(
    transactionSummary,
    balanceReducer
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const amount = Number(formData.get("amount"));
    const transactionType = String(formData.get("type") ?? "");
    if (!transactionType) {
      return;
    }

    startTransition(() => {
      addOptimisticBalance({ amount, type: transactionType });
      startTransition(async () => {
        await fetcher.submit(formData, { method: "POST" });
      });
    });
  };

  const handleChangeType: ChangeEventHandler<HTMLInputElement> = (event) => {
    startTransition(() => setTypeOverride(event.currentTarget.value));
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
