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
    <div className="@container/wallet mt-11 w-full">
      <Card className="grid w-full @lg/wallet:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.15fr)] grid-cols-1 @lg/wallet:items-center gap-6 @lg/wallet:gap-x-18 @lg/wallet:gap-y-0 p-6 sm:gap-9 sm:p-9">
        <h3 className="@lg/wallet:mb-0 mb-4 font-bold @lg/wallet:text-lg text-md text-neutral-900">
          Add or Withdraw Money
        </h3>
        <fetcher.Form
          className="grid w-full min-w-0 gap-4"
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
    </div>
  );
};

export { HostWalletForm };
