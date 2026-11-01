/**
 * Shared `ViewTransition` names that are not van-id or auth-form specific.
 *
 * `hostChart` is mounted by the live timeline, its lazy skeleton, the
 * empty/error wrapper in `LazyMoneyTimeline`, and `RatingMix`. Those owners
 * are mutually exclusive today — at most one is painted per snapshot — so a
 * single name is safe. If two can ever share a tree, split into
 * `host-chart` and `host-chart-state` rather than painting duplicates
 * (CSS View Transitions L1 aborts the whole transition on a name clash).
 */
const chromeViewTransitionName = {
  aboutImage: "about-image",
  balanceAmount: "balance-amount",
  header: "van-header",
  homeImage: "home-image",
  hostChart: "host-chart",
  hostRange: "host-range",
  hostRating: "host-rating",
  moneyInflow: "money-inflow",
  moneyNet: "money-net",
  moneyOutflow: "money-outflow",
  sortableTitle: "sortable-title",
} as const;

export { chromeViewTransitionName };
