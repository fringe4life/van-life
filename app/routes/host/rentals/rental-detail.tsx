import { data, href, redirect, useNavigation } from "react-router";
import { CustomForm } from "~/components/custom-form";
import type { FormActionFailure } from "~/components/form/form-action-result";
import { FormError } from "~/components/form/form-error";
import { getNavigationFormStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { StatusButton } from "~/components/status-button";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import { rentVanSchema } from "~/features/host/rentals/schemas.server";
import { rentVan } from "~/features/host/services/rental.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { VanCard } from "~/features/vans/components/van-card";
import { loadVanBySlug } from "~/features/vans/services/van-detail.server";
import { badRequest } from "~/utils/bad-request";
import { getRouteErrorMessage } from "~/utils/get-route-error-message";
import { notFound } from "~/utils/not-found";
import { validateArkType } from "~/utils/parse-arktype.server";
import { serverError } from "~/utils/server-error";
import { toActionResultOrThrow } from "~/utils/to-action-result.server";
import type { Route } from "./+types/rental-detail";

type RentActionData = FormActionFailure<string>;

export const loader = async ({ params, context }: Route.LoaderArgs) => {
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
    {
      headers: {
        "Cache-Control": "max-age=259200",
      },
    }
  );
};

export const action = async ({ params, context }: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const validation = validateArkType(rentVanSchema, {
    renterId: user.id,
    vanSlug: params.vanSlug,
  });

  if (!validation.success) {
    return badRequest({
      formError: validation.errors.summary || "Invalid rental request",
      ok: false,
    } satisfies RentActionData);
  }

  const result = await rentVan(
    db,
    validation.data.vanSlug,
    validation.data.renterId
  );

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
      <title>Rent {rental.name} | Vanlife</title>
      <meta content="The van you might rent" name="description" />
      <VanCard
        action={<p />}
        link={href("/host/rentals/rent/:vanSlug", { vanSlug: params.vanSlug })}
        van={rental}
      />
      <h2 className="font-bold text-4xl text-neutral-900">Return Van</h2>
      <CustomForm className="mt-6 grid max-w-102 gap-4" method="POST">
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
  <UnsuccesfulState isError message={getRouteErrorMessage(error)} />
);
