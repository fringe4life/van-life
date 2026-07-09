import { ViewTransition } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from "~/constants/constants";
import type { useHostWallet } from "~/features/host/hooks/use-host-wallet";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

interface HostWalletFormProps {
  defaultAmount?: string;
  error?: string;
  wallet: ReturnType<typeof useHostWallet>;
}

const HostWalletForm = ({
  defaultAmount = "",
  error,
  wallet,
}: HostWalletFormProps) => {
  const {
    amountInputId,
    fetcher,
    handleChangeType,
    handleSubmit,
    isDepositing,
    optimisticBalance,
  } = wallet;

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
        <Label htmlFor={amountInputId}>Amount</Label>
        <Input
          defaultValue={defaultAmount}
          id={amountInputId}
          max={isDepositing ? MAX_ADD : optimisticBalance}
          min={isDepositing ? MIN_ADD : MIN_WITHDRAW}
          name="amount"
          placeholder="2000"
          type="number"
        />
        <ViewTransition>
          {error ? <p className="text-red-500">{error}</p> : null}
        </ViewTransition>
        <Button type="submit">Complete transaction</Button>
      </fetcher.Form>
    </Card>
  );
};

export { HostWalletForm };
