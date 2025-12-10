// Type helper to convert VanType values to lowercase

// Type for pagination direction
export type Direction = 'forward' | 'backward';

// Type for review sorting options
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

// Type for Maybe
export type Maybe<T> = T | null | undefined;

export type MaybeError<T> = T | string;
