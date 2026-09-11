import { lazy, Suspense, ViewTransition } from "react";
import { OutcomeState } from "~/components/outcome-state";
import type { CollectionOutcomeProps } from "~/components/types";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
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
      <ViewTransition
        {...viewTransitionPage}
        name={chromeViewTransitionName.hostChart}
      >
        {collectionState.config ? (
          <OutcomeState
            kind={collectionState.kind}
            {...collectionState.config}
          />
        ) : (
          <div aria-hidden="true" />
        )}
      </ViewTransition>
    );
  }
  return (
    <Suspense fallback={<BarChartSkeleton />}>
      <BarChartComponent data={collectionState.data} />
    </Suspense>
  );
};

export { LazyBarChart };
