import { useMemo } from "react";
import type { VanModel } from "~/db/client.server";
import type {
  HostVanListItem,
  VanFormFieldErrors,
  VanFormValues,
} from "~/features/vans/types";
import { isPendingVan } from "~/features/vans/types";

interface CreateVanFetcherData {
  clientKey?: string;
  fieldErrors?: VanFormFieldErrors;
  formData?: VanFormValues;
  formError?: string;
  skipListRevalidation?: boolean;
  van?: VanModel;
}

interface UseDisplayHostVansParams {
  fetcherData: CreateVanFetcherData | undefined;
  fetcherState: "idle" | "submitting" | "loading";
  limit: number;
  optimisticItems: HostVanListItem[];
}

export function useDisplayHostVans({
  optimisticItems,
  fetcherData,
  fetcherState,
  limit,
}: UseDisplayHostVansParams): HostVanListItem[] {
  return useMemo(() => {
    const created =
      fetcherState === "idle" && fetcherData?.van ? fetcherData.van : undefined;

    if (!created) {
      return optimisticItems;
    }

    const clientKey = fetcherData?.clientKey;

    const withoutPending = optimisticItems.filter(
      (item) =>
        !(
          isPendingVan(item) &&
          (item.clientKey === clientKey || item.slug === created.slug)
        )
    );

    const hasCreated = withoutPending.some(
      (item) => !isPendingVan(item) && item.id === created.id
    );

    if (hasCreated) {
      return withoutPending.slice(0, limit);
    }

    return [
      created,
      ...withoutPending.filter((item) => !isPendingVan(item)),
    ].slice(0, limit);
  }, [optimisticItems, fetcherData, fetcherState, limit]);
}
