import { VanType } from '~/generated/prisma/enums';
import type { auth } from '~/lib/auth.server';

// Type helper to convert VanType values to lowercase
export type LowercaseVanType = Lowercase<VanType>;

// Create lowercase versions of VanType for URL compatibility
export const VAN_TYPE_LOWERCASE: LowercaseVanType[] = Object.values(
	VanType
).map((type) => type.toLowerCase() as LowercaseVanType);

export type Session = typeof auth.$Infer.Session;
export type User = Session['user'];
