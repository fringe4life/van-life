import { data, href, redirect } from "react-router";
import { CustomForm } from "~/components/custom-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import { rentVanSchema } from "~/features/host/rentals/schemas.server";
import { rentVan } from "~/features/host/services/rental.server";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { VanCard } from "~/features/vans/components/van-card";
import { loadVanBySlug } from "~/features/vans/services/van-detail.server";
import { getRouteErrorMessage } from "~/utils/get-route-error-message";
import { notFound } from "~/utils/not-found";
import { validateArkType } from "~/utils/parse-arktype.server";
import { serverError } from "~/utils/server-error";
import { tryCatch } from "~/utils/try-catch.server";
import type { Route } from "./+types/rental-detail";

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

export const action = async ({
  request,
  params,
  context,
}: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const formData = Object.fromEntries(await request.formData());

  const hostId = formData.hostId as string;

  const validation = validateArkType(rentVanSchema, {
    hostId,
    renterId: user.id,
    vanSlug: params.vanSlug,
  });

  if (!validation.success) {
    return {
      errors: validation.errors.summary,
      formData,
    };
  }

  const result2 = await tryCatch(() =>
    rentVan(
      db,
      validation.data.vanSlug,
      validation.data.renterId,
      validation.data.hostId
    )
  );

  if (result2.error || !result2.data) {
    return {
      errors: "Something went wrong try again later!",
      formData,
    };
  }
  throw redirect(href("/host/rentals"));
};

const AddVan = ({ actionData, loaderData, params }: Route.ComponentProps) => {
  const { rental } = loaderData;

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
        <Input
          aria-hidden="true"
          className="hidden"
          defaultValue={rental.hostId}
          type="text"
        />
        {actionData?.errors ? <p>{actionData.errors}</p> : null}
        <Button type="submit">Rent {rental.name}</Button>
      </CustomForm>
    </section>
  );
};

export default AddVan;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <UnsuccesfulState isError message={getRouteErrorMessage(error)} />
);
