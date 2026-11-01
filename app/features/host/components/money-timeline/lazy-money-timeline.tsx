import { lazy, Suspense, ViewTransition } from "react";
import { OutcomeState } from "~/components/outcome-state";
import type { CollectionOutcomeProps } from "~/components/types";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import type { MoneyTimelineData } from "~/features/host/utils/money-timeline";
import type { Maybe, Prettify } from "~/types";
import { getCollectionState } from "~/utils/errors/get-collection-state";
import { MoneyTimelineSkeleton } from "./money-timeline-skeleton";

type LazyMoneyTimelineProps = Prettify<
  CollectionOutcomeProps & {
    data: Maybe<MoneyTimelineData>;
    inflowLabel: string;
    outflowLabel: string;
  }
>;

const MoneyTimelineComponent = lazy(() => import("./money-timeline"));

/** Shared by both money routes; direction labels are the only difference. */
const LazyMoneyTimeline = ({
  data,
  emptyState,
  errorState,
  inflowLabel,
  noMatchState,
  noMatchWhen,
  outflowLabel,
}: LazyMoneyTimelineProps) => {
  const collectionState = getCollectionState(data?.buckets ?? null, {
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

  if (!data) {
    return null;
  }

  return (
    <Suspense fallback={<MoneyTimelineSkeleton />}>
      <MoneyTimelineComponent
        data={data}
        inflowLabel={inflowLabel}
        outflowLabel={outflowLabel}
      />
    </Suspense>
  );
};

export { LazyMoneyTimeline };
