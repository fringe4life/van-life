import type { ChangeEventHandler, SubmitEventHandler } from "react";
import type { FetcherWithComponents } from "react-router";
import { Field } from "~/components/form/field";
import type { FormActionResultFrom } from "~/components/form/form-action-result";
import { FormError } from "~/components/form/form-error";
import { getFetcherStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from "~/constants/constants";
import type {
  MONEY_ECHO_FIELDS,
  MONEY_FORM_FIELDS,
} from "~/features/host/types";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";
import { css, cx } from "../../../../../styled-system/css";
import {
  cq,
  grid,
  hstack,
  visuallyHidden,
} from "../../../../../styled-system/patterns";

type HostWalletActionData = FormActionResultFrom<
  object,
  typeof MONEY_FORM_FIELDS,
  typeof MONEY_ECHO_FIELDS
>;

interface HostWalletFormProps {
  fetcher: FetcherWithComponents<HostWalletActionData>;
  isDepositing: boolean;
  isPending: boolean;
  onChangeType: ChangeEventHandler<HTMLInputElement>;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  optimisticBalance: number;
}

const HostWalletForm = ({
  fetcher,
  isDepositing,
  isPending,
  onChangeType,
  onSubmit,
  optimisticBalance,
}: HostWalletFormProps) => {
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
    <div
      className={cx(
        cq({ name: "wallet" }),
        css({ inlineSize: "full", marginBlockStart: "11" })
      )}
    >
      <Card
        className={cx(
          grid({
            "@wallet/lg": {
              alignItems: "center",
              columnGap: "4.5rem",
              gridTemplateAreas: '"heading form"',
              gridTemplateColumns: "minmax(220px, 0.85fr) minmax(0, 1.15fr)",
              rowGap: "0",
            },
            columns: 1,
            gap: { base: "6", sm: "9" },
            gridTemplateAreas: '"heading" "form"',
          }),
          css({
            inlineSize: "full",
            padding: { base: "6", sm: "9" },
          })
        )}
      >
        <h3
          className={css({
            color: "foreground",
            fontSize: { "@wallet/lg": "lg", base: "md" },
            fontWeight: "bold",
            gridArea: "heading",
            marginBlockEnd: { "@wallet/lg": "0", base: "4" },
          })}
        >
          Add or Withdraw Money
        </h3>
        <fetcher.Form
          className={cx(
            grid({ gap: "4" }),
            css({ gridArea: "form", inlineSize: "full", minInlineSize: "0" })
          )}
          method="POST"
          onSubmit={onSubmit}
        >
          <fieldset
            className={css({
              border: "none",
              margin: "0",
              minInlineSize: "0",
              padding: "0",
            })}
          >
            <legend className={visuallyHidden()}>Transaction type</legend>

            <div className={hstack({ gap: "4" })}>
              <Label>
                Deposit
                <Input
                  checked={isDepositing}
                  name="type"
                  onChange={onChangeType}
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
                  onChange={onChangeType}
                  type="radio"
                  value={WITHDRAW}
                />
              </Label>
            </div>
          </fieldset>
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
