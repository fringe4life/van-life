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
import type { FormActionResult } from "~/components/form/form-action-result";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { GenericComponent } from "~/components/generic-component";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { VanModel } from "~/db/client.server";
import { VanForm } from "~/features/host/components/van-form";
import { HOST_VANS_EMPTY_MESSAGE } from "~/features/host/constants/constants";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import { Pagination } from "~/features/pagination/components/pagination";
import { hostPaginationParsers } from "~/features/pagination/parsers";
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
import { gridMax } from "~/styles";
import { badRequest } from "~/utils/errors/bad-request";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "~/utils/errors/parse-schema.server";
import { css, cx } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";
import type { Route } from "./+types/host-vans";

interface HostVansActionSuccess {
  clientKey?: string;
  van: VanModel;
}

type HostVansActionData = FormActionResult<
  HostVansActionSuccess,
  VanFormFieldKey
>;

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const pagination = await loadHostVansPage(db, user.id, request);

  return data(pagination, { headers: PRIVATE_NO_STORE_HEADERS });
};

export const action = async ({ request, context }: Route.ActionArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const rawFormData = await request.formData();
  const clientKey = String(rawFormData.get("clientKey") ?? "");
  rawFormData.delete("clientKey");

  const formData = Object.fromEntries(rawFormData);
  const formValues = toVanFormValues(formData);

  const validation = validateSchema(addVanSchema, formData);

  if (!validation.success) {
    return badRequest({
      fieldErrors: schemaErrorsToFieldErrors(
        validation.errors,
        VAN_FORM_FIELDS
      ),
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

const renderHostVanCardProps = (item: HostVanListItem, index: number) => {
  const van = toVanCardModel(item);
  const pending = isPendingVan(item);

  return {
    action: pending ? (
      <p
        className={css({
          color: "muted.foreground",
          fontSize: "sm",
          fontStyle: "italic",
        })}
      >
        Saving…
      </p>
    ) : (
      <p className={css({ textAlign: "right" })}>
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
    imageIndex: index,
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
        <Activity mode={onFirstPage ? "visible" : "hidden"}>
          <VanForm
            fetcherState={fetcher.state}
            fieldErrors={fieldErrors}
            formDataDefaults={formDataDefaults}
            formError={formError}
            isPending={isPending}
            ok={ok}
            onSubmit={handleSubmit}
          />
        </Activity>
        {onFirstPage ? null : (
          <p
            className={css({
              color: "muted.foreground",
              marginBlockStart: "6",
            })}
          >
            New vans appear at the top of your list.{" "}
            <CustomLink to={href("/host/vans")}>
              Go to first page to add a van
            </CustomLink>
          </p>
        )}
      </section>
      <PendingUI
        as="section"
        className={grid({
          contain: "content",
          gap: "0",
          // biome-ignore assist/source/noDuplicateClasses: grid definition
          gridTemplateRows: "min-content 1fr min-content",
          marginBlockStart: "6",
        })}
      >
        <VanHeader>Your listed vans</VanHeader>
        <GenericComponent<HostVanListItem, VanCardProps>
          as="div"
          Component={VanCard}
          className={cx(gridMax, css({ marginBlockStart: "6" }))}
          emptyState={{ title: HOST_VANS_EMPTY_MESSAGE }}
          errorState={{ title: "Something went wrong" }}
          items={displayItems}
          noMatchState={null}
          renderProps={renderHostVanCardProps}
        />
        <Pagination items={vans} paginationMetadata={paginationMetadata} />
      </PendingUI>
    </>
  );
};
export default HostVans;
