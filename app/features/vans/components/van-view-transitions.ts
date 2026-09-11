/** Shared names for the card-to-detail transition anchors. */
const vanViewTransitionName = {
  image: (id: string) => `van-image-${id}`,
  price: (id: string) => `van-price-${id}`,
  status: (id: string) => `van-status-${id}`,
  title: (id: string) => `van-title-${id}`,
  type: (id: string) => `van-type-${id}`,
} as const;

export { vanViewTransitionName };
