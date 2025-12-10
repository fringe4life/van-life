import { VanType } from '~/generated/prisma/enums';

// Type helper to convert VanType values to lowercase
export type LowercaseVanType = Lowercase<VanType>;

// Create lowercase versions of VanType for URL compatibility
export const VAN_TYPE_LOWERCASE: LowercaseVanType[] = Object.values(
	VanType
).map((type) => type.toLowerCase() as LowercaseVanType);
