import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
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
import { normalizeReviewRating } from "~/features/host/components/review/review-recipe";
import { loadReviewsPage } from "~/features/host/services/reviews.server";
import {
  type ChartHeightBandVariant,
  getChartHeightBandVariantByPointId,
} from "~/features/host/utils/chart-height-bands";
import { VanHeader } from "~/features/vans/components/van-header";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import {
  loadHostSearchParams,
  parsePaginationCursor,
} from "~/pagination/loaders.server";
import { gridMax } from "~/styles";
import type { Prettify } from "~/types";
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

const renderReviewItemProps = (
  { user, text, rating, updatedAt, createdAt, id }: ReviewListItem,
  heightBandByRatingId: ReadonlyMap<string, ChartHeightBandVariant>
) => ({
  date: updatedAt ?? createdAt,
  heightBand:
    heightBandByRatingId.get(String(normalizeReviewRating(rating))) ?? "one",
  id,
  name: user.name,
  rating,
  text,
});

const HostReviews = ({ loaderData }: Route.ComponentProps) => {
  const { chartData, pagePromise, reviewCount } = loaderData;
  const heightBandByRatingId = getChartHeightBandVariantByPointId(chartData);
  const renderReviewProps = (item: ReviewListItem) =>
    renderReviewItemProps(item, heightBandByRatingId);

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
        className={cx(gridMax, css({ marginBlockStart: "6" }))}
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
