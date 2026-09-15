import { useQueryStates } from "nuqs";
import {
  Activity,
  type SubmitEventHandler,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import {
  data,
  href,
  type ShouldRevalidateFunctionArgs,
  useFetcher,
  useLocation,
} from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { is, literal, looseObject } from "valibot";
import { CollectionList } from "~/components/collection-list";
import type { FormActionResult } from "~/components/form/form-action-result";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { CustomLink } from "~/components/links/custom-link";
import { PendingUI } from "~/components/pending-ui";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import { VanForm } from "~/features/host/components/van-form";
import { HOST_VANS_EMPTY_MESSAGE } from "~/features/host/constants/constants";
import { VanCard } from "~/features/vans/components/van-card";
import { VanHeader } from "~/features/vans/components/van-header";
import {
  type HostVansListAction,
  hostVansListReducer,
} from "~/features/vans/hooks/host-vans-list-reducer";
import { useDisplayHostVans } from "~/features/vans/hooks/use-display-host-vans";
import { addVanSchema } from "~/features/vans/schema";
import {
  createHostVan,
  loadHostVansPage,
} from "~/features/vans/services/host-vans.server";
import type {
  HostVanListItem,
  VanFormFieldErrors,
  VanFormFieldKey,
  VanWithChrome,
} from "~/features/vans/types";
import { isPendingVan, VAN_FORM_FIELDS } from "~/features/vans/types";
import { pendingVanFromFormData } from "~/features/vans/utils/pending-van-from-form-data";
import { toVanCardModel } from "~/features/vans/utils/to-van-card-model";
import { toVanFormValues } from "~/features/vans/utils/to-van-form-values";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { Pagination } from "~/pagination/components/pagination";
import { PaginationOffsetTransition } from "~/pagination/components/pagination-offset-transition";
import { hostPaginationParsers } from "~/pagination/parsers";
import { pageSliceKey } from "~/pagination/utils/page-slice-key";
import { withSearch } from "~/pagination/utils/with-search";
import { gridMax } from "~/styles";
import { badRequest } from "~/utils/errors/bad-request";
import {
  schemaErrorsToFieldErrors,
  validateSchema,
} from "~/utils/errors/parse-schema";
import type { Route } from "./+types/host-vans";

interface HostVansActionSuccess {
  clientKey?: string;
  van: VanWithChrome;
}

type HostVansActionData = FormActionResult<
  HostVansActionSuccess,
  VanFormFieldKey
>;

/**
 * Flatten FormData to one value per key — `addVanSchema` is that shape.
 * Action and `handleSubmit` share this so the client gate and POST body
 * are the same bag. Widen this helper and the schema together if a field
 * needs `getAll`.
 */
function addVanFormEntries(formData: FormData) {
  return Object.fromEntries(formData);
}

const hostVansActionSuccessSchema = looseObject({
  ok: literal(true),
});

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

  const formData = addVanFormEntries(rawFormData);
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
  if (is(hostVansActionSuccessSchema, actionResult)) {
    return false;
  }

  return defaultShouldRevalidate;
}

const createHostVanCardProps =
  (search: string) => (item: HostVanListItem, index: number) => {
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
        <span />
      ),
      imageIndex: index,
      link: pending
        ? "#"
        : withSearch(
            href("/host/vans/:vanSlug", { vanSlug: van.slug }),
            search
          ),
      linkCoversCard: !pending,
      van,
    };
  };

const HostVans = ({ loaderData }: Route.ComponentProps) => {
  const { items: vans, paginationMetadata } = loaderData;
  const { search } = useLocation();
  const onFirstPage = !paginationMetadata.hasPreviousPage;

  const [isPending, startTransition] = useTransition();
  const [{ limit }] = useQueryStates(hostPaginationParsers, {
    startTransition,
  });
  const fetcher = useFetcher<HostVansActionData>();

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    vans ?? [],
    hostVansListReducer
  );

  const [clientFieldErrors, setClientFieldErrors] =
    useState<VanFormFieldErrors>({});

  const displayItems = useDisplayHostVans({
    fetcherData: fetcher.data,
    fetcherState: fetcher.state,
    limit,
    optimisticItems,
  });

  const {
    fieldErrors: fetcherFieldErrors,
    formData: formDataDefaults,
    formError,
    ok,
  } = readActionFormData(fetcher.data);

  const fieldErrors = { ...fetcherFieldErrors, ...clientFieldErrors };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const rawFormData = new FormData(event.currentTarget);
    rawFormData.delete("clientKey");

    const formData = addVanFormEntries(rawFormData);
    const validation = validateSchema(addVanSchema, formData);

    if (!validation.success) {
      setClientFieldErrors(
        schemaErrorsToFieldErrors(validation.errors, VAN_FORM_FIELDS)
      );
      return;
    }

    setClientFieldErrors({});

    const clientKey = crypto.randomUUID();
    const pending = pendingVanFromFormData(validation.data, clientKey);

    rawFormData.set("clientKey", clientKey);

    const optimisticAction: HostVansListAction = { item: pending, type: "add" };

    startTransition(() => {
      addOptimisticItem(optimisticAction);
      fetcher.submit(rawFormData, {
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
        <PaginationOffsetTransition sliceKey={pageSliceKey(displayItems)}>
          <CollectionList
            as="div"
            Component={VanCard}
            className={cx(gridMax, css({ marginBlockStart: "6" }))}
            emptyState={{ title: HOST_VANS_EMPTY_MESSAGE }}
            errorState={{ title: "Something went wrong" }}
            items={displayItems}
            noMatchState={null}
            renderProps={createHostVanCardProps(search)}
          />
          <Pagination items={vans} paginationMetadata={paginationMetadata} />
        </PaginationOffsetTransition>
      </PendingUI>
    </>
  );
};
export default HostVans;
