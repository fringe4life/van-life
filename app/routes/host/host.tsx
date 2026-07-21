import { data, redirect } from "react-router";
import type { FormActionResultFrom } from "~/components/form/form-action-result";
import { pickFormValues } from "~/components/form/pick-form-values";
import { PendingUI } from "~/components/pending-ui";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { HostIncomeSection } from "~/features/host/components/dashboard/host-income-section";
import { HostReviewSection } from "~/features/host/components/dashboard/host-review-section";
import { HostVansSection } from "~/features/host/components/dashboard/host-vans-section";
import { HostWalletForm } from "~/features/host/components/dashboard/host-wallet-form";
import { useHostWallet } from "~/features/host/hooks/use-host-wallet";
import { moneySchema } from "~/features/host/schemas.server";
import { loadHostDashboard } from "~/features/host/services/dashboard.server";
import { depositOrWithdraw } from "~/features/host/services/wallet.server";
import { MONEY_ECHO_FIELDS, MONEY_FORM_FIELDS } from "~/features/host/types";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import {
  getRedirectParamFromRequest,
  getSafeRedirectPath,
} from "~/features/middleware/utils/auth-redirect";
import { DEPOSIT } from "~/features/vans/constants/vans-constants";
import { badRequest } from "~/utils/errors/bad-request";
import { getRouteErrorMessage } from "~/utils/errors/get-route-error-message";
import {
  arkErrorsToFieldErrors,
  validateArkType,
} from "~/utils/errors/parse-arktype.server";
import { toActionResultOrThrow } from "~/utils/errors/to-action-result.server";
import type { Route } from "./+types/host";

type HostWalletActionData = FormActionResultFrom<
  object,
  typeof MONEY_FORM_FIELDS,
  typeof MONEY_ECHO_FIELDS
>;

export const headers = forwardDataHeaders;

export const loader = async ({ context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const dashboard = await loadHostDashboard(db, user.id);

  return data(
    {
      ...dashboard,
      name: user.name,
    },
    { headers: PRIVATE_NO_STORE_HEADERS }
  );
};

export const action = async ({ request, context }: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const formData = Object.fromEntries(await request.formData());
  const echoValues = pickFormValues(formData, MONEY_ECHO_FIELDS);
  const validation = validateArkType(moneySchema, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: arkErrorsToFieldErrors(validation.errors, MONEY_FORM_FIELDS),
      formData: echoValues,
      ok: false,
    } satisfies HostWalletActionData);
  }

  const { amount, type: transactionType } = validation.data;

  const result = await depositOrWithdraw(db, user.id, amount, transactionType);

  const actionFailure = toActionResultOrThrow(result, {
    formData: echoValues,
  });
  if (actionFailure) {
    return actionFailure;
  }

  const redirectParam = getRedirectParamFromRequest(request);
  if (transactionType === DEPOSIT && redirectParam) {
    throw redirect(getSafeRedirectPath(redirectParam));
  }

  return { ok: true } satisfies HostWalletActionData;
};

const Host = ({ loaderData }: Route.ComponentProps) => {
  const {
    vansPromise,
    avgRating,
    elapsedDays,
    name,
    sumIncome,
    transactionSummary,
  } = loaderData;

  const wallet = useHostWallet(transactionSummary);

  return (
    <PendingUI as="section">
      <title>Host Dashboard | Van Life</title>
      <meta
        content="Your Van Life host dashboard - manage your vans, view income, and track rentals"
        name="description"
      />
      <HostIncomeSection
        elapsedDays={elapsedDays}
        isBalancePending={wallet.isPending}
        name={name}
        optimisticBalance={wallet.optimisticBalance}
        sumIncome={sumIncome}
      />
      <HostReviewSection avgRating={avgRating} />
      <HostWalletForm wallet={wallet} />
      <HostVansSection vansPromise={vansPromise} />
    </PendingUI>
  );
};
export default Host;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState
    isError
    message={getRouteErrorMessage(error, {
      errorFallback: "Something went wrong loading your dashboard.",
    })}
  />
);
