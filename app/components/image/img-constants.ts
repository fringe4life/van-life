export const DEFAULT_IMAGE_QUALITY = 50;
export const HIGH_QUALITY_IMAGE_QUALITY = 75;

/** First N list thumbs load eager with high fetch priority. */
export const LIST_EAGER_IMAGE_COUNT = 2;

export const FORMAT_REGEX = /fm=\w+/gu;
export const WIDTH_REGEX = /w=\d+/gu;
export const QUALITY_REGEX = /q=\d+/gu;
export const ASPECT_RATIO_REGEX = /ar=[^&]+/gu;
