import type { VanType } from '~/generated/prisma/enums';
import type { Maybe } from '~/types/types';

export type MaybeTypeFilter = Exclude<Maybe<VanType>, null>;

export type LowercaseVanType = Lowercase<VanType>;

// Type for badge variants (includes outline and unavailable)
export type BadgeVariant = LowercaseVanType | 'outline' | 'unavailable';

// Type for nuqs parser that includes empty string
export type VanTypeOrEmpty = LowercaseVanType | '';
