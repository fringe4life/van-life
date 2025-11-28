// Type helper to convert VanType values to lowercase
import type { VanType } from '~/generated/prisma/enums';

export type LowercaseVanType = Lowercase<VanType>;

// Type for badge variants (includes outline and unavailable)
export type BadgeVariant = LowercaseVanType | 'outline' | 'unavailable';

// Type for nuqs parser that includes empty string
export type VanTypeOrEmpty = LowercaseVanType | '';

// Type for pagination direction
export type Direction = 'forward' | 'backward';

// Type for review sorting options
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

// Type for Maybe
export type Maybe<T> = T | null | undefined;
