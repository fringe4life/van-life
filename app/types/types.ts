// Type helper to convert VanType values to lowercase
export type LowercaseVanType = 'simple' | 'rugged' | 'luxury';

// Type for badge variants (includes outline and unavailable)
export type BadgeVariant = LowercaseVanType | 'outline' | 'unavailable';

// Type for nuqs parser that includes empty string
export type VanTypeOrEmpty = LowercaseVanType | '';
