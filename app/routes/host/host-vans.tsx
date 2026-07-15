import { useQueryStates } from "nuqs";
import {
  Activity,
  type SubmitEventHandler,
  useOptimistic,
  useTransition,
} from "react";
import {
  data,
  href,
  type ShouldRevalidateFunctionArgs,
  useFetcher,
} from "react-router";
import { GenericComponent } from "~/components/generic-component";
import type { FormActionResult } from "~/components/form/form-action-result";
import { PendingUI } from "~/components/pending-ui";
import { readActionFormData } from "~/components/form/read-action-form-data";
import type { VanModel } from "~/db/client.server";
import { VanForm } from "~/features/host/components/van-form";
import { HOST_VANS_EMPTY_MESSAGE } from "~/features/host/constants/constants";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { CustomLink } from "~/features/navigation/components/custom-link";
import { Pagination } from "~/features/pagination/components/pagination";
import { VanCard } from "~/features/vans/components/van-card";
import { VanHeader } from "~/features/vans/components/van-header";
import {
  type HostVansListAction,
  hostVansListReducer,
} from "~/features/vans/hooks/host-vans-list-reducer";
import { useDisplayHostVans } from "~/features/vans/hooks/use-display-host-vans";
import { addVanSchema } from "~/features/vans/schemas.server";
import {
  createHostVan,
  loadHostVansPage,
} from "~/features/vans/services/host-vans.server";
import type {
  HostVanListItem,
  VanCardProps,
  VanFormFieldKey,
} from "~/features/vans/types";
import { isPendingVan, VAN_FORM_FIELDS } from "~/features/vans/types";
import { pendingVanFromFormData } from "~/features/vans/utils/pending-van-from-form-data";
import { toVanCardModel } from "~/features/vans/utils/to-van-card-model";
import { toVanFormValues } from "~/features/vans/utils/to-van-form-values";
import { hostPaginationParsers } from "~/lib/parsers";
import { badRequest } from "~/utils/bad-request";
import {
  arkErrorsToFieldErrors,
  validateArkType,
} from "~/utils/parse-arktype.server";
import type { Route } from "./+types/host-vans";

type HostVansActionSuccess = {
  clientKey?: string;
  van: VanModel;
};

type HostVansActionData = FormActionResult<
  HostVansActionSuccess,
  VanFormFieldKey
>;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const pagination = await loadHostVansPage(db, user.id, request);

  return data(pagination, {
    headers: {
      "Cache-Control": "max-age=259200",
    },
  });
};

export const action = async ({ request, context }: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const rawFormData = await request.formData();
  const clientKey = String(rawFormData.get("clientKey") ?? "");
  rawFormData.delete("clientKey");

  const formData = Object.fromEntries(rawFormData);
  const formValues = toVanFormValues(formData);

  const validation = validateArkType(addVanSchema, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: arkErrorsToFieldErrors(validation.errors, VAN_FORM_FIELDS),
      formData: formValues,
      ok: false,
    } satisfies HostVansActionData);
  }

  const result2 = await createHostVan(db, user.id, validation.data);

  if (result2.error || !result2.data) {
    return badRequest({
      formData: formValues,
      formError: "Something went wrong please try again later",
      ok: false,
    } satisfies HostVansActionData);
  }

  return {
    clientKey: clientKey || undefined,
    ok: true,
    van: result2.data,
  } satisfies HostVansActionData;
};

/**
 * Success returns the created van for client merge (`useDisplayHostVans`).
 * Skip loader revalidation so the list does not reload under the optimistic UI.
 * Failures already skip via `badRequest` (400).
 */
export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (
    actionResult &&
    typeof actionResult === "object" &&
    "ok" in actionResult &&
    actionResult.ok === true
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}

const renderHostVanCardProps = (item: HostVanListItem) => {
  const van = toVanCardModel(item);
  const pending = isPendingVan(item);

  return {
    action: pending ? (
      <p className="text-right text-neutral-500 text-sm italic">Saving…</p>
    ) : (
      <p className="text-right">
        <CustomLink
          to={href("/host/vans/:vanSlug/:action?", {
            action: "edit",
            vanSlug: van.slug,
          })}
        >
          Edit
        </CustomLink>
      </p>
    ),
    link: pending
      ? "#"
      : href("/host/vans/:vanSlug/:action?", {
          vanSlug: van.slug,
        }),
    linkCoversCard: !pending,
    van,
  };
};

const HostVans = ({ loaderData }: Route.ComponentProps) => {
  const { items: vans, paginationMetadata } = loaderData;
  const onFirstPage = !paginationMetadata.hasPreviousPage;

  const [{ limit }] = useQueryStates(hostPaginationParsers);
  const fetcher = useFetcher<HostVansActionData>();
  const [isPending, startTransition] = useTransition();

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    vans ?? [],
    hostVansListReducer
  );

  const displayItems = useDisplayHostVans({
    fetcherData: fetcher.data,
    fetcherState: fetcher.state,
    limit,
    optimisticItems,
  });

  const {
    fieldErrors,
    formData: formDataDefaults,
    formError,
    ok,
  } = readActionFormData(fetcher.data);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const clientKey = crypto.randomUUID();
    const pending = pendingVanFromFormData(formData, clientKey);

    formData.set("clientKey", clientKey);

    const optimisticAction: HostVansListAction = { item: pending, type: "add" };

    startTransition(() => {
      addOptimisticItem(optimisticAction);
      fetcher.submit(formData, {
        action: href("/host/vans"),
        method: "POST",
      });
    });
  };

  return (
    <>
      <title>Your Vans | Van Life</title>
      <meta
        content="View and manage your listed vans on Van Life"
        name="description"
      />
      <section>
        <h2 className="font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
          Add Van
        </h2>
        <Activity mode={onFirstPage ? "visible" : "hidden"}>
          <VanForm
            fieldErrors={fieldErrors}
            formDataDefaults={formDataDefaults}
            formError={formError}
            fetcherState={fetcher.state}
            isPending={isPending}
            onSubmit={handleSubmit}
            ok={ok}
          />
        </Activity>
        {onFirstPage ? null : (
          <p className="mt-6 text-neutral-600">
            New vans appear at the top of your list.{" "}
            <CustomLink to={href("/host/vans")}>
              Go to first page to add a van
            </CustomLink>
          </p>
        )}
      </section>
      <PendingUI
        as="section"
        className="grid grid-rows-[min-content_1fr_min-content] contain-content"
      >
        <VanHeader>Your listed vans</VanHeader>
        <GenericComponent<HostVanListItem, VanCardProps>
          as="div"
          Component={VanCard}
          className="grid-max mt-6"
          emptyStateMessage={HOST_VANS_EMPTY_MESSAGE}
          errorStateMessage="Something went wrong"
          items={displayItems}
          renderProps={renderHostVanCardProps}
        />
        <Pagination items={vans} paginationMetadata={paginationMetadata} />
      </PendingUI>
    </>
  );
};
export default HostVans;
