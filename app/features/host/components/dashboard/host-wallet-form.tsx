import { Field } from "~/components/form/field";
import { FormError } from "~/components/form/form-error";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from "~/constants/constants";
import type { useHostWallet } from "~/features/host/hooks/use-host-wallet";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

interface HostWalletFormProps {
  wallet: ReturnType<typeof useHostWallet>;
}

const HostWalletForm = ({ wallet }: HostWalletFormProps) => {
  const {
    fetcher,
    handleChangeType,
    handleSubmit,
    isDepositing,
    isPending,
    optimisticBalance,
  } = wallet;

  const { fieldErrors, formData, formError, ok } = readActionFormData(
    fetcher.data,
    { defaults: { amount: "" } }
  );
  // Remount amount input after success so the field clears (uncontrolled).
  const amountInputKey =
    ok === true ? `ok-${fetcher.state}` : `echo-${formData.amount}`;

  const status = useAutoIdleStatus(
    getFetcherStatus(fetcher.state, fetcher.data, {
      isTransitionPending: isPending,
    })
  );

  return (
    <Card className="mt-11 py-6 sm:py-9 md:w-1/2">
      <h3 className="mb-4 font-bold text-lg text-neutral-900 sm:text-xl">
        Add or Withdraw Money
      </h3>
      <fetcher.Form
        className="grid max-w-102 gap-4"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4">
          <Label>
            Deposit
            <Input
              checked={isDepositing}
              name="type"
              onChange={handleChangeType}
              required
              type="radio"
              value={DEPOSIT}
            />
          </Label>
          <Label>
            Withdraw
            <Input
              checked={!isDepositing}
              name="type"
              onChange={handleChangeType}
              type="radio"
              value={WITHDRAW}
            />
          </Label>
        </div>
        <Field error={fieldErrors?.amount} label="Amount">
          {(a11y) => (
            <Input
              key={amountInputKey}
              {...a11y}
              defaultValue={formData.amount}
              max={isDepositing ? MAX_ADD : optimisticBalance}
              min={isDepositing ? MIN_ADD : MIN_WITHDRAW}
              name="amount"
              placeholder="2000"
              type="number"
            />
          )}
        </Field>
        <FormError message={formError} />
        <StatusButton status={status} type="submit">
          Complete transaction
        </StatusButton>
      </fetcher.Form>
    </Card>
  );
};

export { HostWalletForm };
