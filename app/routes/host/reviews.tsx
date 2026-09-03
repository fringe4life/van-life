import { data } from "react-router";
import { DeferredPaginated } from "~/components/deferred/paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { ReviewModel, UserModel } from "~/db/client.server";
import { LazyBarChart } from "~/features/host/components/bar-chart/lazy-bar-chart";
import { Review } from "~/features/host/components/review/review";
import { ReviewListSkeleton } from "~/features/host/components/review/review-list-skeleton";
import { loadReviewsPage } from "~/features/host/services/reviews.server";
import { vHostList } from "~/features/host/styles";
import { authContext } from "~/features/middleware/contexts/auth";
import { dbContext } from "~/features/middleware/contexts/db";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/features/pagination/loaders.server";
import { VanHeader } from "~/features/vans/components/van-header";
import { gridMax } from "~/styles";
import type { Prettify } from "~/types";
import { css, cx } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";
import type { Route } from "./+types/reviews";

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = context.get(authContext);
  const db = context.get(dbContext);

  const { cursor, limit, direction, sort } = loadHostSearchParams(request);
  const page = await loadReviewsPage(db, user.id, {
    cursor: parsePaginationCursor(cursor),
    direction,
    limit,
    sort,
  });

  return data(page, { headers: PRIVATE_NO_STORE_HEADERS });
};

type ReviewListItem = Prettify<ReviewModel & { user: Pick<UserModel, "name"> }>;

const renderReviewProps = ({
  user,
  text,
  rating,
  updatedAt,
  createdAt,
  id,
}: ReviewListItem) => ({
  id,
  name: user.name,
  rating,
  text,
  // TODO: UTC→viewer-TZ in loader; toLocaleDateString() can mismatch SSR vs client
  timestamp: updatedAt?.toLocaleDateString() ?? createdAt.toLocaleDateString(),
});

const HostReviews = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, pagePromise, reviewCount } = loaderData;

  return (
    <PendingUI
      as="section"
      className={cx(
        grid({
          contain: "content",
          gap: "0",
          gridTemplateRows:
            // biome-ignore assist/source/noDuplicateClasses: grid template rows
            "min-content var(--chart-height) min-content 1fr min-content",
        })
      )}
    >
      <title>Reviews | Van Life</title>
      <meta
        content="View reviews and ratings from your van rentals"
        name="description"
      />
      <VanHeader>Your Reviews</VanHeader>

      {/*
        Option: defer chart like the list — return chartPromise from loader (don't await),
        wrap with DeferredAwait + BarChartSkeleton fallback, then LazyBarChart inside.
        Unblocks TTFB when aggregation is slow; list defer alone already feels fast.
      */}
      <LazyBarChart
        data={chartData}
        emptyState={{ title: "You have no reviews" }}
        errorState={{
          description: "Please try again.",
          title: "Something went wrong",
        }}
        noMatchState={null}
      />
      <Sortable itemCount={reviewCount} title="Reviews" />

      <DeferredPaginated
        as="div"
        Component={Review}
        className={cx(gridMax, vHostList, css({ marginBlockStart: "6" }))}
        emptyState={{ title: "You have received no reviews" }}
        errorState={{ title: "Something went wrong" }}
        fallback={<ReviewListSkeleton />}
        noMatchState={null}
        renderProps={renderReviewProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostReviews;
