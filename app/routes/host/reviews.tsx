import { ViewTransition } from "react";
import { data } from "react-router";
import { css, cx } from "styled-system/css";
import { flex, grid } from "styled-system/patterns";
import { DeferredPaginated } from "~/components/deferred/paginated";
import { PendingUI } from "~/components/pending-ui";
import { Sortable } from "~/components/sortable";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { ReviewModel, UserModel } from "~/db/client.server";
import { RatingMix } from "~/features/host/components/review/rating-mix";
import { RatingStars } from "~/features/host/components/review/rating-stars";
import { Review } from "~/features/host/components/review/review";
import { ReviewListSkeleton } from "~/features/host/components/review/review-list-skeleton";
import { VanHeader } from "~/features/vans/components/van-header";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { gridMax } from "~/styles";
import type { Prettify } from "~/types";
import type { Route } from "./+types/reviews";

export const headers = forwardDataHeaders;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  /**
   * Workaround: these `.server` modules are imported here, not at the top of the
   * module, because a static import survives React Router's client export removal
   * and then trips its `.server` resolver. See `app/routes/host/rental-activity.tsx`
   * for the full note.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [{ loadHostSearchParams, parsePaginationCursor }, { loadReviewsPage }] =
    await Promise.all([
      import("~/pagination/loaders.server"),
      import("~/features/host/services/reviews.server"),
    ]);

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

const renderReviewItemProps = ({
  createdAt,
  id,
  rating,
  text,
  updatedAt,
  user,
}: ReviewListItem) => ({
  date: updatedAt ?? createdAt,
  id,
  name: user.name,
  rating,
  text,
});

const HostReviews = ({ loaderData }: Route.ComponentProps) => {
  const { pagePromise, ratingMix, reviewCount } = loaderData;

  return (
    <PendingUI
      as="section"
      className={grid({
        contain: "content",
        gap: "0",
        gridTemplateRows: "min-content 1fr",
      })}
    >
      <title>Reviews | Van Life</title>
      <meta
        content="View reviews and ratings from your van rentals"
        name="description"
      />

      <div
        className={flex({
          alignItems: "center",
          flexWrap: "wrap",
          gap: "3",
          justifyContent: "space-between",
        })}
      >
        <VanHeader>Your Reviews</VanHeader>

        {reviewCount > 0 ? (
          <ViewTransition
            {...viewTransitionShare}
            name={chromeViewTransitionName.hostRating}
          >
            <RatingStars rating={ratingMix.average} />
          </ViewTransition>
        ) : null}
      </div>

      {reviewCount > 0 ? <RatingMix {...ratingMix} /> : null}

      <Sortable itemCount={reviewCount} title="Reviews" />

      <DeferredPaginated
        as="div"
        Component={Review}
        className={cx(gridMax, css({ marginBlockStart: "6" }))}
        emptyState={{ title: "You have received no reviews" }}
        errorState={{ title: "Something went wrong" }}
        fallback={<ReviewListSkeleton />}
        noMatchState={null}
        renderProps={renderReviewItemProps}
        resolve={pagePromise}
      />
    </PendingUI>
  );
};
export default HostReviews;
