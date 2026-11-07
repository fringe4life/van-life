import { data, href, redirect, useNavigation } from "react-router";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { grid } from "styled-system/patterns";
import { summarize } from "valibot";
import { CustomForm } from "~/components/custom-form";
import type { FormActionFailure } from "~/components/form/form-action-result";
import { FormError } from "~/components/form/form-error";
import { getNavigationFormStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import { StatusButton } from "~/components/status-button";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { VanCard } from "~/features/vans/components/van-card";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { badRequest } from "~/utils/errors/bad-request";
import { notFound } from "~/utils/errors/not-found";
import { validateSchema } from "~/utils/errors/parse-schema";
import { serverError } from "~/utils/errors/server-error";
import type { Route } from "./+types/rental-detail";

type RentActionData = FormActionFailure<string>;

export const headers = forwardDataHeaders;

export const loader = async ({ params, context }: Route.LoaderArgs) => {
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
  const { loadVanBySlug } = await import(
    "~/features/vans/services/van-detail.server"
  );

  const db = context.get(dbContext);
  const result = await loadVanBySlug(db, params.vanSlug);

  if (result.error) {
    serverError("Failed to load rental details. Please try again later.");
  }

  if (!result.data) {
    notFound("Van not found");
  }

  return data(
    {
      rental: result.data,
    },
    { headers: PRIVATE_NO_STORE_HEADERS }
  );
};

export const action = async ({ params, context }: Route.ActionArgs) => {
  // Workaround: same `.server` import reason as the loader above (#402).
  const [{ rentVanSchema }, { rentVan }, { toActionResultOrThrow }] =
    await Promise.all([
      import("~/features/host/rentals/schema.server"),
      import("~/features/host/services/rental.server"),
      import("~/utils/errors/to-action-result.server"),
    ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);

  const validation = validateSchema(rentVanSchema, {
    renterId: user.id,
    vanSlug: params.vanSlug,
  });

  if (!validation.success) {
    return badRequest({
      formError: summarize(validation.errors) || "Invalid rental request",
      ok: false,
    } satisfies RentActionData);
  }

  const result = await rentVan(db, validation.data.vanSlug, user.id);

  const actionFailure = toActionResultOrThrow(result);
  if (actionFailure) {
    return actionFailure;
  }

  throw redirect(href("/host/rentals"));
};

const AddVan = ({ actionData, loaderData, params }: Route.ComponentProps) => {
  const { rental } = loaderData;
  const navigation = useNavigation();
  const isFormNavigation = Boolean(navigation.formMethod);
  const status = useAutoIdleStatus(
    getNavigationFormStatus(navigation.state, actionData, {
      isFormNavigation,
    })
  );

  const { formError } = readActionFormData(actionData);

  return (
    <section>
      <title>{`Rent ${rental.name} | Vanlife`}</title>
      <meta content="The van you might rent" name="description" />
      <VanCard
        action={<p />}
        link={href("/host/rentals/rent/:vanSlug", { vanSlug: params.vanSlug })}
        van={rental}
      />

      <h2
        className={css({
          color: "foreground",
          fontSize: "4xl",
          fontWeight: "bold",
        })}
      >
        Return Van
      </h2>
      <CustomForm
        className={cx(
          grid({ gap: "4" }),
          css({ marginBlockStart: "6", maxInlineSize: "25.5rem" })
        )}
        method="POST"
      >
        <FormError message={formError} />
        <StatusButton status={status} type="submit">
          Rent {rental.name}
        </StatusButton>
      </CustomForm>
    </section>
  );
};

export default AddVan;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary error={error} />
);
