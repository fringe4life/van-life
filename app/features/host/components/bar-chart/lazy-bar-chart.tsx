import { lazy, Suspense } from "react";
import { css } from "styled-system/css";
import { OutcomeState } from "~/components/outcome-state";
import type { CollectionOutcomeProps } from "~/components/types";
import type { Data, DataArray } from "~/features/host/types";
import type { Maybe, Prettify } from "~/types";
import { getCollectionState } from "~/utils/errors/get-collection-state";
import { BarChartSkeleton } from "./bar-chart-skeleton";

type LazyBarChartProps = Prettify<
  Data<Maybe<DataArray>> & CollectionOutcomeProps
>;

const BarChartComponent = lazy(() => import("./bar-chart"));
const LazyBarChart = ({
  data,
  emptyState,
  errorState,
  noMatchState,
  noMatchWhen,
}: LazyBarChartProps) => {
  const collectionState = getCollectionState(data, {
    emptyState,
    errorState,
    noMatchState,
    noMatchWhen,
  });
  if (!collectionState.ok) {
    return (
      <div className={css({ viewTransitionName: "host-chart" })}>
        {collectionState.config ? (
          <OutcomeState
            kind={collectionState.kind}
            {...collectionState.config}
          />
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    );
  }
  return (
    <Suspense fallback={<BarChartSkeleton />}>
      <BarChartComponent data={collectionState.data} />
    </Suspense>
  );
};

export { LazyBarChart };
