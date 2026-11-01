import { data, redirect } from "react-router";
import type { FormActionResultFrom } from "~/components/form/form-action-result";
import { pickFormValues } from "~/components/form/pick-form-values";
import { PendingUI } from "~/components/pending-ui";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { HostIncomeSection } from "~/features/host/components/dashboard/host-income-section";
import { HostReviewSection } from "~/features/host/components/dashboard/host-review-section";
import { HostVansSection } from "~/features/host/components/dashboard/host-vans-section";
import { HostWalletForm } from "~/features/host/components/dashboard/host-wallet-form";
import { useHostWallet } from "~/features/host/hooks/use-host-wallet";
import { MONEY_ECHO_FIELDS, MONEY_FORM_FIELDS } from "~/features/host/types";
import { DEPOSIT } from "~/features/vans/constants/vans-constants";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import {
  getRedirectParamFromRequest,
  getSafeRedirectPath,
} from "~/middleware/utils/auth-redirect";
import { badRequest } from "~/utils/errors/bad-request";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "~/utils/errors/parse-schema";
import type { Route } from "./+types/host";

type HostWalletActionData = FormActionResultFrom<
  object,
  typeof MONEY_FORM_FIELDS,
  typeof MONEY_ECHO_FIELDS
>;

export const headers = forwardDataHeaders;

export const loader = async ({ context }: Route.LoaderArgs) => {
  /**
   * Workaround: `.server` module imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver, so the route's client bundle never loads.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200 and the page
   * hydrates. Full note: `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const { loadHostDashboard } = await import(
    "~/features/host/services/dashboard.server"
  );

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
  // Workaround: same `.server` import reason as the loader above (#402).
  const [{ moneySchema }, { depositOrWithdraw }, { toActionResultOrThrow }] =
    await Promise.all([
      import("~/features/host/schema.server"),
      import("~/features/host/services/wallet.server"),
      import("~/utils/errors/to-action-result.server"),
    ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);

  const formData = Object.fromEntries(await request.formData());
  const echoValues = pickFormValues(formData, MONEY_ECHO_FIELDS);
  const validation = validateSchema(moneySchema, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: schemaErrorsToFieldErrors(
        validation.errors,
        MONEY_FORM_FIELDS
      ),
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
    name,
    rangeLabel,
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
        isBalancePending={wallet.isPending}
        name={name}
        optimisticBalance={wallet.optimisticBalance}
        rangeLabel={rangeLabel}
        sumIncome={sumIncome}
      />
      <HostReviewSection avgRating={avgRating} />
      <HostWalletForm
        fetcher={wallet.fetcher}
        isDepositing={wallet.isDepositing}
        isPending={wallet.isPending}
        onChangeType={wallet.handleChangeType}
        onSubmit={wallet.handleSubmit}
        optimisticBalance={wallet.optimisticBalance}
      />
      <HostVansSection vansPromise={vansPromise} />
    </PendingUI>
  );
};
export default Host;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary
    emptyState={{
      primaryAction: { label: "Return to dashboard", to: "/host" },
      secondaryAction: { label: "View your vans", to: "/host/vans" },
    }}
    error={error}
    errorFallback="Something went wrong loading your dashboard."
    errorState={{
      secondaryAction: { label: "Return to dashboard", to: "/host" },
    }}
  />
);
