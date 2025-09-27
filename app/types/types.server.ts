import { VanType } from '~/generated/prisma/enums';
import type { auth } from '~/lib/auth.server';

// Type helper to convert VanType values to lowercase
export type LowercaseVanType = Lowercase<VanType>;

// Create lowercase versions of VanType for URL compatibility
export const VAN_TYPE_LOWERCASE: LowercaseVanType[] = Object.values(
	VanType
).map((type) => type.toLowerCase() as LowercaseVanType);

// Type helper to extract the return type from async functions
// biome-ignore lint/suspicious/noExplicitAny: any is the most reasonable type to use here
export type QueryType<T extends (...args: any[]) => any> = Awaited<
	ReturnType<T>
>;

export type Session = typeof auth.$Infer.Session;
