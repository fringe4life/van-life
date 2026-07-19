import { lazy, Suspense } from "react";
import type { EmptyState, ErrorState } from "~/components/types";
import { UnsuccesfulState } from "~/components/unsuccesful-state";
import type { Data, DataArray } from "~/features/host/types";
import type { Maybe, Prettify } from "~/types";
import { getCollectionState } from "~/utils/get-collection-state";
import { BarChartSkeleton } from "./bar-chart-skeleton";

type LazyBarChartProps = Prettify<
  Data<Maybe<DataArray>> & EmptyState & ErrorState
>;

const BarChartComponent = lazy(() => import("./bar-chart.client"));
const LazyBarChart = ({
  data,
  errorStateMessage,
  emptyStateMessage,
}: LazyBarChartProps) => {
  const collectionState = getCollectionState(data, {
    emptyStateMessage,
    errorStateMessage,
  });
  if (collectionState.kind !== "ok") {
    return (
      <div className="v-host-chart">
        <UnsuccesfulState
          isError={collectionState.kind === "error"}
          message={collectionState.message}
        />
      </div>
    );
  }
  return (
    <Suspense fallback={<BarChartSkeleton />}>
      <BarChartComponent data={collectionState.items} />
    </Suspense>
  );
};

export { LazyBarChart };
